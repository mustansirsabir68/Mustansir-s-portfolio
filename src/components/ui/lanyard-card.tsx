import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'

import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import { Environment, Lightformer, useTexture } from '@react-three/drei'
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier'
import type { RapierRigidBody, RigidBodyProps } from '@react-three/rapier'

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

/* -------------------------------------------------------------------------- */
/*                                  ID card                                   */
/* -------------------------------------------------------------------------- */

// Physics-driven hanging badge: a card clipped to a cord that swings under gravity and can be dragged.
// Adapted from React Bits' "Lanyard" example. Every RigidBody uses `colliders: false` so Rapier's
// auto-collider doesn't fight the manual ones, and angular velocity is counter-rotated instead of
// locking rotations.

const PIN_IMAGE_URL = 'https://cdn.21st.dev/assets/mirror/ad/ad5d58b0ab86bd893f0ab4792d68136796a8a319061f9a834bbee109941617c0.png'

const UP = new THREE.Vector3(0, 1, 0)
const ROPE_RADIUS = 0.1
const ROPE_RADIAL_SEGMENTS = 24
const ROPE_TAPER_FRACTION = 0.06
const CARD_ROPE_ANCHOR_Y = 1.1
const ROPE_TOP_EXTENSION = -0.5

const PIN_IMAGE_ASPECT = 1024 / 1536
const PIN_IMAGE_BOTTOM_PAD_FRACTION = (1536 - 1432) / 1536
const CARD_TOP_EDGE_Y = 0.93
const PIN_PLANE_HEIGHT = 1.4
const PIN_PLANE_WIDTH = PIN_PLANE_HEIGHT * PIN_IMAGE_ASPECT
const PIN_PLANE_Y = CARD_TOP_EDGE_Y + PIN_PLANE_HEIGHT * -PIN_IMAGE_BOTTOM_PAD_FRACTION
const PIN_PLANE_X = 0
const PIN_PLANE_Z = ROPE_RADIUS + 0.06

// Card face in the group's local space (the group is scaled x4 below).
const CARD_WIDTH = 0.716
const CARD_HEIGHT = 1
const CARD_BOTTOM_Y = 0.023
const CARD_CORNER_RADIUS = 0.05
const CARD_CANVAS_SCALE = 1000
const ACCENT_STRIPE_HEIGHT_RATIO = 0.03

// Rounded-rectangle face with UVs spanning the full texture.
const buildCardFaceGeometry = () => {
  const x0 = -CARD_WIDTH / 2
  const x1 = CARD_WIDTH / 2
  const y0 = CARD_BOTTOM_Y
  const y1 = CARD_BOTTOM_Y + CARD_HEIGHT
  const r = CARD_CORNER_RADIUS
  const shape = new THREE.Shape()

  shape.moveTo(x0 + r, y0)
  shape.lineTo(x1 - r, y0)
  shape.quadraticCurveTo(x1, y0, x1, y0 + r)
  shape.lineTo(x1, y1 - r)
  shape.quadraticCurveTo(x1, y1, x1 - r, y1)
  shape.lineTo(x0 + r, y1)
  shape.quadraticCurveTo(x0, y1, x0, y1 - r)
  shape.lineTo(x0, y0 + r)
  shape.quadraticCurveTo(x0, y0, x0 + r, y0)

  const geometry = new THREE.ShapeGeometry(shape, 12)
  const position = geometry.getAttribute('position')
  const uv = geometry.getAttribute('uv')

  for (let i = 0; i < position.count; i++) {
    uv.setXY(i, (position.getX(i) - x0) / CARD_WIDTH, (position.getY(i) - y0) / CARD_HEIGHT)
  }

  return geometry
}

type LanyardRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 }

const getLerped = (body: LanyardRigidBody) => {
  if (!body.lerped) {
    body.lerped = new THREE.Vector3().copy(body.translation())
  }

  return body.lerped
}

// TubeGeometry with a per-ring radius that tapers to 0 at t=0, instead of a flat cut.
const buildTaperedTubeGeometry = (
  curve: THREE.CatmullRomCurve3,
  tubularSegments: number,
  radius: number,
  radialSegments: number,
  taperFraction: number
) => {
  const frames = curve.computeFrenetFrames(tubularSegments, false)
  const positions: number[] = []
  const normals: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  const vertex = new THREE.Vector3()
  const normal = new THREE.Vector3()

  for (let i = 0; i <= tubularSegments; i++) {
    const t = i / tubularSegments
    const point = curve.getPointAt(t)
    const N = frames.normals[i]
    const B = frames.binormals[i]
    const ringRadius = t < taperFraction ? radius * (t / taperFraction) : radius

    for (let j = 0; j <= radialSegments; j++) {
      const angle = (j / radialSegments) * Math.PI * 2
      const sin = Math.sin(angle)
      const cos = -Math.cos(angle)

      normal.x = cos * N.x + sin * B.x
      normal.y = cos * N.y + sin * B.y
      normal.z = cos * N.z + sin * B.z
      normal.normalize()
      normals.push(normal.x, normal.y, normal.z)

      vertex.x = point.x + ringRadius * normal.x
      vertex.y = point.y + ringRadius * normal.y
      vertex.z = point.z + ringRadius * normal.z
      positions.push(vertex.x, vertex.y, vertex.z)

      uvs.push(t, j / radialSegments)
    }
  }

  for (let j = 1; j <= tubularSegments; j++) {
    for (let i = 1; i <= radialSegments; i++) {
      const a = (radialSegments + 1) * (j - 1) + (i - 1)
      const b = (radialSegments + 1) * j + (i - 1)
      const c = (radialSegments + 1) * j + i
      const d = (radialSegments + 1) * (j - 1) + i

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // Guard against a bad Frenet frame: reject non-finite or absurdly large vertices
  // instead of letting the GPU rasterise a screen-sized stray tube.
  // Valid cords live within the 4-unit rig; anything larger is a bad frame.
  const finite = positions.every((value) => Number.isFinite(value) && Math.abs(value) < 6)
  const normalFinite = normals.every((value) => Number.isFinite(value) && Math.abs(value) <= 1.5)

  if (!finite || !normalFinite) return null

  const geometry = new THREE.BufferGeometry()

  geometry.setIndex(indices)
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3))
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))

  return geometry
}

// Resolves any CSS colour (including oklch from the theme tokens) to an rgb() string three.js can parse.
const resolveRgb = (cssColor: string) => {
  const canvas = document.createElement('canvas')

  canvas.width = 1
  canvas.height = 1

  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  if (!ctx) return 'rgb(0 0 0)'

  ctx.clearRect(0, 0, 1, 1)
  ctx.fillStyle = cssColor
  ctx.fillRect(0, 0, 1, 1)

  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

  return `rgb(${r}, ${g}, ${b})`
}

type CardColors = { accent: string; rope: string }

type BandProps = {
  frontImage: string
  isMobile: boolean
  colors: CardColors
}

const Band = ({ frontImage, isMobile, colors }: BandProps) => {
  const rope = useRef<THREE.Mesh>(null!)
  const fixed = useRef<RapierRigidBody>(null!)
  const j1 = useRef<LanyardRigidBody>(null!)
  const j2 = useRef<LanyardRigidBody>(null!)
  const j3 = useRef<RapierRigidBody>(null!)
  const card = useRef<RapierRigidBody>(null!)

  const vec = new THREE.Vector3()
  const ang = new THREE.Vector3()
  const rot = new THREE.Vector3()
  const dir = new THREE.Vector3()
  const cardQuat = new THREE.Quaternion()

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 1.5,
    linearDamping: 1.5
  }

  const frontTexture = useTexture(frontImage)
  const pinTexture = useTexture(PIN_IMAGE_URL)
  const cardGeometry = useMemo(() => buildCardFaceGeometry(), [])

  const cardMap = useMemo(() => {
    const width = Math.round(CARD_WIDTH * CARD_CANVAS_SCALE)
    const height = Math.round(CARD_HEIGHT * CARD_CANVAS_SCALE)
    const canvas = document.createElement('canvas')

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    const image = frontTexture.image as HTMLImageElement

    if (ctx) {
      // Cover-fit the photo, then add the accent stripe along the top edge.
      const scale = Math.max(width / image.width, height / image.height)
      const dw = image.width * scale
      const dh = image.height * scale

      ctx.drawImage(image, (width - dw) / 2, (height - dh) / 2, dw, dh)
      ctx.fillStyle = colors.accent
      ctx.fillRect(0, 0, width, height * ACCENT_STRIPE_HEIGHT_RATIO)
    }

    const texture = new THREE.CanvasTexture(canvas)

    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 16
    texture.needsUpdate = true

    return texture
  }, [frontTexture, colors.accent])

  const [curve] = useState(() => {
    const ropeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3()
    ])

    ropeCurve.curveType = 'chordal'

    return ropeCurve
  })

  const [dragged, drag] = useState<THREE.Vector3 | false>(false)

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 0.85])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 0.85])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 0.85])
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, CARD_ROPE_ANCHOR_Y, 0]
  ])

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z })
    }

    if (fixed.current) {
      ;[j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current)
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())))

        lerped.lerp(ref.current.translation(), delta * 50 * clampedDistance)
      })

      // Keeps the rope glued to the pin at any card orientation.
      const cardPos = card.current.translation()
      const cardRot = card.current.rotation()

      cardQuat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w)
      curve.points[0]
        .set(0, CARD_ROPE_ANCHOR_Y + ROPE_TOP_EXTENSION, 0)
        .applyQuaternion(cardQuat)
        .add(vec.set(cardPos.x, cardPos.y, cardPos.z))
      curve.points[1].copy(getLerped(j2.current))
      curve.points[2].copy(getLerped(j1.current))
      curve.points[3].copy(fixed.current.translation())

      // A straight cylinder between the card anchor and the fixed point is
      // stable, cheap, and never degenerates the way a per-frame Frenet tube can.
      const points = curve.points
      const span = new THREE.Vector3().subVectors(points[3], points[0])
      const length = span.length()

      if (rope.current && Number.isFinite(length) && length > 0.05 && length < 8) {
        rope.current.position.copy(points[0]).addScaledVector(span, 0.5)
        rope.current.scale.set(1, length, 1)
        rope.current.quaternion.setFromUnitVectors(UP, span.normalize())
      }

      ang.copy(card.current.angvel())
      rot.copy(card.current.rotation() as unknown as THREE.Vector3)
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true)
    }
  })

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type='fixed' />
        <RigidBody position={[0.425, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.85, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.275, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.7, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[1.42, 2.0, 0.018]} />
          <group
            scale={4}
            position={[0, -3.16, -0.09]}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).releasePointerCapture(e.pointerId)
              drag(false)
              document.body.style.userSelect = ''
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              ;(e.target as Element).setPointerCapture(e.pointerId)
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current!.translation())))
              document.body.style.userSelect = 'none'
            }}
          >
            <mesh geometry={cardGeometry} position={[0, 0, 0.004]}>
              <meshBasicMaterial map={cardMap} toneMapped={false} />
            </mesh>
            <mesh geometry={cardGeometry} position={[0, 0, 0.001]} rotation={[0, Math.PI, 0]}>
              <meshBasicMaterial map={cardMap} toneMapped={false} />
            </mesh>
          </group>

          <mesh position={[PIN_PLANE_X, PIN_PLANE_Y, PIN_PLANE_Z]}>
            <planeGeometry args={[PIN_PLANE_WIDTH, PIN_PLANE_HEIGHT]} />
            <meshBasicMaterial map={pinTexture} transparent alphaTest={0.1} toneMapped={false} />
          </mesh>
        </RigidBody>

        {/* The rope shares the bind group's transform with the bodies it connects. */}
        <mesh ref={rope} frustumCulled={false}>
          <cylinderGeometry args={[ROPE_RADIUS * 0.55, ROPE_RADIUS, 1, 10]} />
          <meshStandardMaterial color={colors.rope} roughness={0.45} metalness={0.1} />
        </mesh>
      </group>
    </>
  )
}

const LIGHT = new THREE.Color().setRGB(1, 1, 1)

const StudioLighting = () => (
  <Environment blur={0.75}>
    <Lightformer intensity={2} color={LIGHT} position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={3} color={LIGHT} position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer intensity={3} color={LIGHT} position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
    <Lightformer
      intensity={10}
      color={LIGHT}
      position={[-10, 0, 14]}
      rotation={[0, Math.PI / 2, Math.PI / 3]}
      scale={[100, 10, 1]}
    />
  </Environment>
)

const REFERENCE_HEIGHT_PX = 520
const CAMERA_Z = 20
const CAMERA_FOV_DEG = 20
const WORLD_UNITS_PER_PX = (2 * CAMERA_Z * Math.tan((CAMERA_FOV_DEG / 2) * (Math.PI / 180))) ** -1
const PX_PER_WORLD_UNIT = REFERENCE_HEIGHT_PX * WORLD_UNITS_PER_PX
const TARGET_FROM_RIGHT_FRACTION = 0.3
const TARGET_FROM_RIGHT_FRACTION_AT_LG = 0.15
const LG_BREAKPOINT_PX = 1024
const XL_BREAKPOINT_PX = 1280

// Below lg the canvas is a short, in-flow block, so the rig is framed to fit it
// instead of keeping the desktop pixel scale (which pushed the card off-screen).
// The settled card spans roughly y -3.5..1.1 around the pin, so the mobile
// frame centres on that span rather than on the desktop camera's origin.
const FIT_CENTER_Y = -1.2
const FIT_HALF_HEIGHT = 2.9
const FIT_HALF_WIDTH = 1.8

const CameraAlign = () => {
  useFrame(state => {
    if (state.size.width < LG_BREAKPOINT_PX) {
      const tanHalfFov = Math.tan((CAMERA_FOV_DEG / 2) * (Math.PI / 180))
      const aspect = state.size.width / state.size.height
      const zForHeight = FIT_HALF_HEIGHT / tanHalfFov
      const zForWidth = FIT_HALF_WIDTH / (tanHalfFov * aspect)

      state.camera.position.x = 0
      state.camera.position.y = FIT_CENTER_Y
      state.camera.position.z = Math.max(zForHeight, zForWidth)

      return
    }

    const widthT = THREE.MathUtils.clamp(
      (state.size.width - LG_BREAKPOINT_PX) / (XL_BREAKPOINT_PX - LG_BREAKPOINT_PX),
      0,
      1
    )

    const targetFromRightFraction = THREE.MathUtils.lerp(
      TARGET_FROM_RIGHT_FRACTION_AT_LG,
      TARGET_FROM_RIGHT_FRACTION,
      widthT
    )

    const targetFromRightPx = targetFromRightFraction * state.size.width

    state.camera.position.y = 0
    state.camera.position.x = (targetFromRightPx - state.size.width / 2) / PX_PER_WORLD_UNIT
    state.camera.position.z = CAMERA_Z * (state.size.height / REFERENCE_HEIGHT_PX)
  })

  return null
}

const IdCard = ({ frontImage, className }: { frontImage: string; className?: string }) => {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [canDrag, setCanDrag] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  )
  const [contextLossKey, setContextLossKey] = useState(0)
  const eventSourceRef = useRef<HTMLElement | null>(typeof document !== 'undefined' ? document.body : null)

  // Hidden elements that bridge resolved Tailwind theme colours into canvas / three.js.
  const primaryProbeRef = useRef<HTMLSpanElement>(null)
  const foregroundProbeRef = useRef<HTMLSpanElement>(null)
  // Concrete defaults so the first frame (before the probes resolve the CSS
  // tokens) never feeds three.js an unparseable colour.
  const [colors, setColors] = useState<CardColors>({ accent: '#c9f24e', rope: '#e8e8de' })

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const dragQuery = window.matchMedia('(max-width: 1023px)')
    const handleMobile = () => setIsMobile(mobileQuery.matches)
    const handleDrag = () => setCanDrag(dragQuery.matches)

    handleMobile()
    handleDrag()
    mobileQuery.addEventListener('change', handleMobile)
    dragQuery.addEventListener('change', handleDrag)

    return () => {
      mobileQuery.removeEventListener('change', handleMobile)
      dragQuery.removeEventListener('change', handleDrag)
    }
  }, [])

  useEffect(() => {
    const updateColors = () => {
      if (!primaryProbeRef.current || !foregroundProbeRef.current) return

      const accent = resolveRgb(getComputedStyle(primaryProbeRef.current).fill)
      const rope = resolveRgb(getComputedStyle(foregroundProbeRef.current).fill)

      setColors(prev => (prev.accent === accent && prev.rope === rope ? prev : { accent, rope }))
    }

    updateColors()

    // Watches ancestors' class/style so light/dark switches re-colour the card and rope.
    const observers: MutationObserver[] = []

    for (let node: HTMLElement | null = primaryProbeRef.current; node; node = node.parentElement) {
      const observer = new MutationObserver(updateColors)

      observer.observe(node, { attributes: true, attributeFilter: ['class', 'style'] })
      observers.push(observer)
    }

    return () => observers.forEach(observer => observer.disconnect())
  }, [])

  return (
    <div aria-hidden='true' className={cn('pointer-events-none drop-shadow-xl', className)}>
      <span ref={primaryProbeRef} className='fill-primary hidden' />
      <span ref={foregroundProbeRef} className='fill-foreground hidden' />
      <Canvas
        key={contextLossKey}
        // Below lg the canvas is in flow, so it takes pointer events itself (and
        // blocks touch scrolling over the badge, which a drag needs). At lg it
        // overlays the hero copy and must stay transparent to clicks.
        style={canDrag ? { pointerEvents: 'auto', touchAction: 'none' } : { pointerEvents: 'none' }}
        eventSource={eventSourceRef as RefObject<HTMLElement>}
        camera={{ position: [0, 0, 20], fov: 20 }}
        dpr={[1, isMobile ? 1.25 : 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: 'default' }}
        onCreated={state => {
          state.gl.setClearAlpha(0)

          state.gl.domElement.addEventListener('webglcontextlost', event => {
            event.preventDefault()
            setContextLossKey(key => key + 1)
          })

          // Pointer NDC from the canvas's own rect, since eventSource is document.body.
          state.setEvents({
            compute: (event, s) => {
              const rect = s.gl.domElement.getBoundingClientRect()
              const x = event.clientX - rect.left
              const y = event.clientY - rect.top

              s.pointer.set((x / s.size.width) * 2 - 1, -(y / s.size.height) * 2 + 1)
              s.raycaster.setFromCamera(s.pointer, s.camera)
            }
          })
        }}
      >
        <CameraAlign />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -40, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Suspense fallback={null}>
            <Band frontImage={frontImage} isMobile={isMobile} colors={colors} />
          </Suspense>
        </Physics>
        <StudioLighting />
      </Canvas>
    </div>
  )
}

export default IdCard
