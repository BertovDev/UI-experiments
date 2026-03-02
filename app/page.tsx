import EXPERIMENTS from "@/lib/constants"
import { Wrapper } from "@/components/layout/wrapper"
import { Link } from "@/components/ui/link"
import Image from "next/image"

export default function Home() {
  return (
    <Wrapper theme="dark">
      <section className="mx-auto flex min-h-[80vh] w-full max-w-3xl flex-col justify-center px-safe pt-header-height">
        <h1 className="font-semibold text-4xl tracking-tight md:text-6xl">
          Experiments #001
        </h1>

        <ul className="mt-10 grid grid-cols-4 gap-6 sm:grid-cols-2">
          {EXPERIMENTS.map((experiment) => (
            <li key={experiment.path}>
              <Link
                href={experiment.path}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden rounded-lg border border-secondary/10">
                  <Image
                    src={experiment.previewImage}
                    alt={`${experiment.name} preview`}
                    loading="eager"
                    fill
                    className="transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 font-mono text-sm uppercase">
                    {experiment.name}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </Wrapper>
  )
}
