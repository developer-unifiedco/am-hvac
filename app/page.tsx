import Image from "next/image";
import { ContactForm } from "./contact-form";
import { Hero } from "./hero";
import { SectionMotion } from "./section-motion";

const services = [
  ["HVAC installation", "Air conditioning and ventilation for new spaces."],
  ["Preventive maintenance", "Scheduled servicing to reduce breakdowns."],
  ["AC repair and troubleshooting", "Inspection, diagnosis and repair."],
  ["Ventilation systems", "Fresh air circulation throughout your building."],
  ["Ducting and air distribution", "Ductwork for effective airflow."],
  ["System upgrades", "Improvements and replacements for existing systems."],
];
const sectors = [
  [
    "villa",
    "Residential",
    "Buildings and villas",
    "Contemporary villa set among trees",
  ],
  [
    "office",
    "Commercial",
    "Offices and commercial buildings",
    "Glass office towers seen from street level",
  ],
  ["hotel", "Hospitality", "Hotels and resorts", "Poolside hotel terrace"],
  [
    "retail",
    "Retail",
    "Shops and shopping centres",
    "Multi-storey shopping atrium",
  ],
  [
    "warehouse",
    "Logistics",
    "Warehouses and factories",
    "Distribution warehouse with high-bay storage",
  ],
  [
    "ahu",
    "Industrial",
    "Industrial facilities",
    "Air handling equipment and industrial ductwork",
  ],
];
const process = [
  ["Consultation", "We discuss your space and what you need."],
  ["Site inspection", "We assess the building and its existing systems."],
  ["Planning and quotation", "Review the proposed work and cost."],
  ["Installation or service", "Our technicians carry out the agreed work."],
  ["Testing and handover", "We verify performance and explain the system."],
];
const questions = [
  [
    "Do you install HVAC for commercial projects?",
    "Yes. We install air conditioning and ventilation for offices, retail spaces and industrial facilities.",
  ],
  [
    "Can I arrange regular maintenance?",
    "Yes. We plan preventive servicing around your system and how the building is used.",
  ],
  [
    "How do I book a site inspection?",
    "Use the enquiry form below to tell us about your building and arrange a visit.",
  ],
];

function Photo({
  name,
  alt,
  sizes = "(max-width: 700px) 100vw, 55vw",
}: {
  name: string;
  alt: string;
  sizes?: string;
}) {
  return (
    <div className={`photo photo-${name}`} data-parallax>
      <Image fill src={`/media/${name}.webp`} alt={alt} sizes={sizes} />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a href="#about" className="skip">
        Skip to content
      </a>
      <main>
        <Hero />
        <section id="about" className="about section">
          <p className="section-label">About AM HVAC</p>
          <div className="about-intro">
            <h2 data-lift>
              Heating, ventilation and air conditioning for buildings across the
              UAE.
            </h2>
          </div>
          <Photo
            name="ahu"
            alt="Detail of rooftop air handling equipment"
            sizes="185px"
          />
          <div className="about-foot">
            <p>
              From installation to preventive maintenance, we look after your
              system.
            </p>
            <a className="action" href="#services">
              Explore services <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>
        <section id="services" className="section services">
          <div className="service-reel">
            <div className="service-aperture">
              <div className="service-backdrop" aria-hidden="true" />
              <div className="count-mask" aria-hidden="true">
                <span className="service-number">{services.length}</span>
              </div>
              <h2 className="service-heading">
                <span>{services.length}</span> HVAC services
              </h2>
            </div>
          </div>
          <div className="service-grid">
            <figure>
              <Photo
                name="roof"
                alt="Network of metal ducts across a commercial rooftop"
              />
              <div className="service-details" aria-hidden="true">
                {["slat", "elbow", "fan"].map((name) => (
                  <div key={name}>
                    <Image
                      src={`/media/${name}.webp`}
                      fill
                      alt=""
                      sizes="14vw"
                    />
                  </div>
                ))}
              </div>
              <figcaption>Air distribution</figcaption>
            </figure>
            <dl>
              {services.map(([title, description]) => (
                <div key={title}>
                  <dt className="ink-title">{title}</dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
        <section id="industries" className="section industries">
          <div className="intro-row">
            <h2 data-lift>The spaces we serve.</h2>
            <p>
              Residential, commercial and industrial HVAC services across the
              UAE.
            </p>
          </div>
          <div className="sector-grid">
            {[0, 2, 4].map((first) => (
              <div className="industry-spread" key={sectors[first][0]}>
                <div className="spread-stage">
                  {sectors
                    .slice(first, first + 2)
                    .map(([name, tag, title, alt]) => (
                      <figure key={name}>
                        <Photo name={name} alt={alt} />
                        <figcaption>
                          <span>{tag}</span>
                          <h3>{title}</h3>
                        </figcaption>
                      </figure>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="process" className="section process">
          <h2 className="process-title" data-lift>
            How we work
          </h2>
          <Photo
            name="ahu"
            alt="Air handling units installed in line on a building roof"
            sizes="100vw"
          />
          <div className="step-grid">
            <div className="process-aside">
              <h3>
                From site inspection
                <br />
                to handover.
              </h3>
              <div className="process-stills" aria-hidden="true">
                {["slat", "elbow", "fan"].map((name) => (
                  <div key={name}>
                    <Image
                      src={`/media/${name}.webp`}
                      alt=""
                      fill
                      sizes="16vw"
                    />
                  </div>
                ))}
              </div>
            </div>
            <ol>
              {process.map(([title, description]) => (
                <li key={title}>
                  <div>
                    <h4 className="ink-title">{title}</h4>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <section className="section faq" id="questions">
          <h2 data-lift>Frequently asked questions</h2>
          <div className="answers">
            {questions.map(([question, answer]) => (
              <article key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section quote-intro">
          <div>
            <h2 data-lift>
              <span className="line-mask">
                <span>Let’s make your</span>
              </span>{" "}
              <span className="line-mask">
                <span>space more</span>
              </span>{" "}
              <span className="line-mask">
                <span>comfortable.</span>
              </span>
            </h2>
            <div className="quote-foot">
              <p>
                Talk to us about a new installation, repair or maintenance plan.
              </p>
              <a className="action" href="#contact">
                Get a free quote <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <Photo
            name="factory"
            alt="Architectural detail of a commercial building"
          />
        </section>
        <section id="contact" className="section enquiry">
          <div>
            <p className="section-label">Contact AM HVAC</p>
            <h2 data-lift>
              Tell us about
              <br />
              your project.
            </h2>
          </div>
          <ContactForm />
        </section>
      </main>
      <footer className="section">
        <a
          href="#top"
          className="footer-mark"
          aria-label="AM HVAC, back to top"
        >
          <Image src="/media/am.png" width={175} height={79} alt="" />
        </a>
        <nav aria-label="Footer navigation">
          <a href="#services">Services</a>
          <a href="#industries">Industries</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="footer-base">
          <span>AM HVAC</span>
          <span>United Arab Emirates</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
      <SectionMotion />
    </>
  );
}
