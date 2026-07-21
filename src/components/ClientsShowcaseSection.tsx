const clientVideos = [
  {
    src: "/clientes-contemplados/cliente-contemplado-01.mp4",
    title: "Cliente contemplado 1",
  },
  {
    src: "/clientes-contemplados/cliente-contemplado-02.mp4",
    title: "Cliente contemplado 2",
  },
  {
    src: "/clientes-contemplados/cliente-contemplado-03.mp4",
    title: "Cliente contemplado 3",
  },
  {
    src: "/clientes-contemplados/cliente-contemplado-04.mp4",
    title: "Cliente contemplado 4",
  },
];

const ClientsShowcaseSection = () => {
  return (
    <section id="clientes" className="border-t border-black/10 bg-background py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary md:text-4xl">
            Clientes contemplados
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Histórias reais de clientes que avançaram em seus planos com a AMX.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clientVideos.map((video) => (
            <article
              key={video.src}
              className="overflow-hidden rounded-xl border border-black/10 bg-card shadow-md transition-all hover:-translate-y-1 hover:border-black/40 hover:shadow-xl"
            >
              <div className="aspect-[9/16] bg-black">
                <video
                  src={video.src}
                  title={video.title}
                  className="h-full w-full object-contain"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsShowcaseSection;
