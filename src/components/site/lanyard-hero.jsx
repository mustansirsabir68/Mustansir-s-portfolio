import { HeroSection44 } from '../ui/shadcn-studio-hero-section-44'
import photoImage from '../../assets/images/photo.png'
import blazorIcon from '../../assets/images/tech/blazor.svg'
import dotnetIcon from '../../assets/images/tech/dotnet.svg'
import gitIcon from '../../assets/images/tech/git.svg'
import githubIcon from '../../assets/images/tech/github.svg'
import javascriptIcon from '../../assets/images/tech/javascript.svg'
import nugetIcon from '../../assets/images/tech/nuget.svg'
import reactIcon from '../../assets/images/tech/react.svg'
import viteIcon from '../../assets/images/tech/vite.svg'
import { name } from '../../your_info'

// Real technologies from the capability content. Local Simple Icons SVGs (lime),
// so the marquee never depends on a third-party CDN and recolor via CSS filters.
const brandLogos = [
  { name: 'C# / .NET', image: dotnetIcon },
  { name: 'Blazor', image: blazorIcon },
  { name: 'React', image: reactIcon },
  { name: 'JavaScript', image: javascriptIcon },
  { name: 'Git', image: gitIcon },
  { name: 'Vite', image: viteIcon },
  { name: 'GitHub', image: githubIcon },
  { name: 'NuGet', image: nugetIcon },
]

export function LanyardHero() {
  return (
    <div id="top">
      <HeroSection44
        greetings={['Hello']}
        name={`${name.firstname} ${name.lastname}`}
        role="Software engineer · .NET systems"
        availabilityLabel="Open to new roles"
        description="I build fast, secure enterprise systems across the .NET ecosystem, and sweat the details that make them feel effortless."
        profileImage={photoImage}
        downloadAction={{ label: 'Résumé', href: name.url }}
        connectAction={{ label: "Let's connect", href: '#contact' }}
        brandLogos={brandLogos}
      />
    </div>
  )
}
