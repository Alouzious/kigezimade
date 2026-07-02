import { Heart, Users, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import { Seo } from '../components/HowToBuy'

const pillars = [
  {
    icon: Users,
    title: 'Youth learning crafts',
    text: 'When tourists buy direct, young people see craft as income, not something to leave behind for city jobs.',
    bg: 'from-lake/15 to-sage',
  },
  {
    icon: Heart,
    title: 'Women and girls',
    text: 'Beadwork and basket cooperatives give young women economic independence and pride in Bakiga heritage.',
    bg: 'from-bead/15 to-parchment',
  },
  {
    icon: Sparkles,
    title: 'Living traditions',
    text: 'Every sale keeps drum-making, barkcloth, and weaving alive for the next generation in Kigezi.',
    bg: 'from-amber/15 to-cream',
  },
]

export default function Impact() {
  return (
    <div>
      <Seo title="Our Impact" description="Supporting artisans, youth, and women in Kabale, Kisoro, Kanungu, and Rukiga." />
      <section className="relative py-20 md:py-28 overflow-hidden">
        <img src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1600&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/75 to-forest/50" />
        <div className="relative max-w-3xl mx-auto px-6 text-center text-cream">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-light font-bold mb-4">Our mission</p>
          <h1 className="heading-display text-4xl md:text-6xl text-cream">More than a marketplace</h1>
          <p className="text-cream/85 mt-6 text-lg leading-relaxed">
            Kigezi Made exists so artisans, especially youth and young women,
            can earn fairly, tell their own stories, and pass craft traditions forward.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <div key={p.title} className={`p-8 rounded-2xl bg-gradient-to-br ${p.bg} border border-border-warm card-elevated`}>
              <div className="w-14 h-14 rounded-2xl bg-forest/10 flex items-center justify-center mb-5">
                <p.icon size={24} className="text-forest" />
              </div>
              <h2 className="font-serif text-xl font-bold mb-3">{p.title}</h2>
              <p className="text-stone leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Button to="/register" variant="primary" size="lg">Join as an artisan</Button>
        </div>
      </section>
    </div>
  )
}
