import aboutImg from "@/assets/about-preview.jpg";
import programsImg from "@/assets/programs-preview.jpg";
import skillsImg from "@/assets/skills-preview.jpg";
import impactImg from "@/assets/impact-preview.jpg";
import prayerImg from "@/assets/prayer-preview.jpg";
import volunteerImg from "@/assets/volunteer-preview.jpg";
import heroImg from "@/assets/hero-community.jpg";
import founderImg from "@/assets/founder-esther.jpg";

const images = [
  { src: heroImg, alt: "Community gathering" },
  { src: aboutImg, alt: "Honeybee team with children" },
  { src: programsImg, alt: "Children in classroom" },
  { src: skillsImg, alt: "Youth skills training" },
  { src: impactImg, alt: "Happy children together" },
  { src: prayerImg, alt: "Community prayer" },
  { src: volunteerImg, alt: "Volunteers building together" },
  { src: founderImg, alt: "Esther Awori, Founder" },
];

const Gallery = () => {
  return (
    <section className="section-spacing">
      <div className="wide-container">
        <h1 className="page-title">Gallery</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-12 max-w-2xl">
          Moments from our community — the children, programs, and people that make Honeybee Ministries what it is.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`rounded-xl overflow-hidden group cursor-pointer ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full min-h-[180px] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
