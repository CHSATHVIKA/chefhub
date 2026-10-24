const IMAGE = 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=1200&q=80'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="grid overflow-hidden rounded-[2rem] border border-line bg-card shadow-soft lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <img src={IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute inset-x-10 bottom-10 text-cream">
            <p className="font-display text-3xl font-semibold leading-snug">
              "The best dinner parties happen at home. We just bring the chef."
            </p>
            <p className="mt-4 text-sm text-cream/70">ChefHub &middot; Home chefs in five cities</p>
          </div>
        </div>
        <div className="p-6 sm:p-12">
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p className="mt-2 text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
