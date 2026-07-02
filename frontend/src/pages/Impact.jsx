import {
  Heart,
  Users,
  Sparkles,
  Handshake,
  Globe,
  Shield,
  Target,
  Eye,
  Gem,
  Map,
  BookOpen,
  Smartphone,
} from 'lucide-react'
import Button from '../components/Button'
import DisplayHeadline from '../components/DisplayHeadline'
import { Seo } from '../components/HowToBuy'

const coreValues = [
  {
    icon: Handshake,
    title: 'Fair trade',
    text: 'Artisans set their own prices. Buyers pay makers directly, with no hidden cuts.',
    accent: 'from-bead/20 to-parchment',
  },
  {
    icon: Gem,
    title: 'Cultural pride',
    text: 'Every craft carries Bakiga heritage. We celebrate stories, not just products.',
    accent: 'from-amber/20 to-cream',
  },
  {
    icon: Users,
    title: 'Youth empowerment',
    text: 'Young people see craft as real income and a future worth staying home for.',
    accent: 'from-lake/20 to-sage',
  },
  {
    icon: Heart,
    title: 'Women-led growth',
    text: 'Cooperatives and beadwork groups put economic power in the hands of women and girls.',
    accent: 'from-bead/15 to-sage',
  },
  {
    icon: Shield,
    title: 'Transparency',
    text: 'Named makers, open workshops, and honest connections between buyer and artisan.',
    accent: 'from-forest/10 to-parchment',
  },
]

const strategicPillars = [
  {
    icon: Globe,
    title: 'Direct trade',
    text: 'A digital marketplace that removes middlemen and sends value straight to Kigezi workshops.',
  },
  {
    icon: BookOpen,
    title: 'Heritage storytelling',
    text: 'Cultural narratives with every product so tourists and buyers understand what they are supporting.',
  },
  {
    icon: Map,
    title: 'Tourism integration',
    text: 'Craft trails, workshop visits, and maps that link Lake Bunyonyi, Bwindi, and Virunga trips to real makers.',
  },
  {
    icon: Smartphone,
    title: 'Digital skills for artisans',
    text: 'Simple tools for photos, orders, and shop profiles so makers can sell online with confidence.',
  },
  {
    icon: Sparkles,
    title: 'Community cooperatives',
    text: 'Strength in groups: basket weavers, beadworkers, and drum makers growing together across districts.',
  },
]

export default function Impact() {
  return (
    <div>
      <Seo
        title="Our Impact"
        description="Mission, vision, and values of Kigezi Made. Supporting artisans in Kabale, Kisoro, Kanungu, and Rukiga."
      />

      {/* Hero — same headline style as home */}
      <section className="relative min-h-[min(70svh,640px)] md:min-h-[75vh] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1600&q=80"
          alt="Artisan weaving in Kigezi"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/80 to-forest/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/75 via-forest/25 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pb-10 pt-28 sm:pb-16 md:pb-20 w-full text-center md:text-left">
          <p className="label-kicker !text-amber-light mb-4">Our impact</p>
          <DisplayHeadline
            line1="More than a marketplace."
            line2="A movement for makers."
            className="mx-auto md:mx-0"
          />
          <p className="text-cream/90 text-base sm:text-lg max-w-2xl mt-5 sm:mt-6 leading-relaxed font-medium mx-auto md:mx-0">
            Kigezi Made connects artisans, youth, and young women in Southwest Uganda
            to fair income, proud heritage, and buyers who care who made their craft.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-section-warm pattern-dots">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <article className="p-8 md:p-10 rounded-2xl card-elevated bg-gradient-to-br from-sage to-cream border border-border-warm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center">
                  <Target size={22} className="text-forest" />
                </div>
                <p className="label-kicker !text-forest">Our mission</p>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal mb-4 leading-snug">
                Fair income through direct connection
              </h2>
              <p className="text-stone leading-relaxed text-base md:text-lg">
                To connect artisans in Kabale, Kisoro, Kanungu, and Rukiga directly with
                tourists and buyers, so makers earn fairly, tell their own stories, and keep
                craft traditions alive for the next generation.
              </p>
            </article>

            <article className="p-8 md:p-10 rounded-2xl card-elevated bg-gradient-to-br from-amber/10 to-parchment border border-border-warm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-bead/15 flex items-center justify-center">
                  <Eye size={22} className="text-bead" />
                </div>
                <p className="label-kicker">Our vision</p>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal mb-4 leading-snug">
                A thriving Kigezi of named makers
              </h2>
              <p className="text-stone leading-relaxed text-base md:text-lg">
                A region where every artisan is known by name, every product has a cultural
                story, youth choose craft as a career, and women lead cooperatives that
                shape the local economy with pride.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-16 md:py-24 bg-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <p className="label-kicker mb-3">What we stand for</p>
            <h2 className="heading-display text-3xl md:text-5xl text-charcoal">
              Core values
            </h2>
            <p className="text-stone mt-4 leading-relaxed">
              The principles behind every product, partnership, and workshop visit on Kigezi Made.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {coreValues.map((v) => (
              <div
                key={v.title}
                className={`p-6 md:p-8 rounded-2xl bg-gradient-to-br ${v.accent} border border-border-warm card-elevated`}
              >
                <div className="w-12 h-12 rounded-xl bg-cream/80 flex items-center justify-center mb-4 shadow-sm">
                  <v.icon size={22} className="text-forest" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal mb-2">{v.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic pillars */}
      <section className="py-16 md:py-24 bg-section-sage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-14">
            <div className="max-w-xl">
              <p className="label-kicker mb-3">How we deliver</p>
              <h2 className="heading-display text-3xl md:text-5xl text-charcoal">
                Strategic pillars
              </h2>
              <p className="text-stone mt-4 leading-relaxed">
                Five focus areas that turn our mission into real change across Kigezi.
              </p>
            </div>
            <div className="hidden md:block w-24 h-1 rounded-full bg-gradient-to-r from-bead via-amber to-lake" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {strategicPillars.map((p, i) => (
              <div
                key={p.title}
                className="group p-6 md:p-8 rounded-2xl card-elevated bg-gradient-to-b from-cream to-parchment border border-border-warm hover:-translate-y-1 transition-transform duration-300"
              >
                <span className="text-xs font-bold text-bead uppercase tracking-widest">
                  Pillar {i + 1}
                </span>
                <div className="w-12 h-12 rounded-xl bg-forest/10 flex items-center justify-center my-4 group-hover:bg-forest/15 transition-colors">
                  <p.icon size={22} className="text-forest" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal mb-2">{p.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-section-forest text-cream relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <DisplayHeadline
            line1="Be part of the story."
            line2="Join as a maker."
            size="section"
            className="mx-auto !text-center"
          />
          <p className="text-cream/80 mt-5 mb-8 leading-relaxed max-w-lg mx-auto">
            Register free, list your crafts, and reach tourists and buyers who value your name and your work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button to="/register" variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
              Join as an artisan
            </Button>
            <Button
              to="/marketplace"
              variant="outline"
              size="lg"
              className="w-full sm:w-auto justify-center border-cream/80 text-cream hover:bg-cream hover:text-forest bg-cream/10"
            >
              Explore marketplace
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
