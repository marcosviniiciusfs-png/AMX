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
    <section id="clientes" className="bg-black py-20 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/45">
              Histórias contempladas
            </p>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              Gente que saiu da simulação e avançou no plano.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-white/65">
            Veja relatos de clientes que conquistaram andamento real com acompanhamento próximo da equipe AMX.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clientVideos.map((video, index) => (
            <article key={video.src} className="border border-white/15 bg-white/5 p-3">
              <div className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-[0.16em] text-white/45">
                <span>AMX</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
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
