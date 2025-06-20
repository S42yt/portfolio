import CardGrid from "./cardGrid";
import Card from "./card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faUser, faCodeBranch } from "@fortawesome/free-solid-svg-icons";

const ImageIcons = {
  tradeCycle: "/icons/trade-cycle.png",
  biogg: "/icons/biogg.png",
  cutecraft: "/icons/cutecraft-icon.png",
};

export default function CardHome() {
  return (
    <CardGrid>
      <Card
        icon={<FontAwesomeIcon icon={faGithub} className="w-8 h-8" />}
        title="GitHub Profile"
        image="emojis/cina_walk.gif"
        description="Here you can see my GitHub profile and all my projects i published so far."
        hoverColor="#431266"
        href="https://github.com/S42yt"
      />

      <Card
        icon={<FontAwesomeIcon icon={faUser} className="w-8 h-8" />}
        title="About Me"
        image="emojis/kuromi_spin.gif"
        description="Here is a small about me that shows off my skills and preferences."
        hoverColor="#381ee3"
        route="/about"
      />

      <Card
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={ImageIcons.tradeCycle}
            className="w-8 h-8"
            alt="Trade Cycle"
          />
        }
        title="Trade Cycle"
        image="emojis/kuromi_roll.gif"
        description="This is a plugin i coded as a server side alternative of the Trade Cycling mod."
        hoverColor="#18DB62"
        route="/trade-cycle"
      />

      <Card
        // eslint-disable-next-line @next/next/no-img-element
        icon={<img src={ImageIcons.biogg} className="w-8 h-8" alt="Biogg" />}
        title="Biogg"
        image="emojis/kuromi_snort.gif"
        description="Biogg is a bio page i worked on and still use till this day."
        hoverColor="#42D1CD"
        route="/biogg"
      />

      <Card
        icon={
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ImageIcons.cutecraft} className="w-8 h-8" alt="CuteCraft" />
        }
        title="CuteCraft"
        image="emojis/kuromi_laugh.gif"
        description="CuteCraft is a German Minecraft CityBuild network where i mainly focus on the websites and designs of the items."
        hoverColor="#F3A5BE"
        route="/cutecraft"
      />

      <Card
        icon={<FontAwesomeIcon icon={faCodeBranch} className="w-8 h-8" />}
        title="Source Code"
        image="emojis/kuromi_blush.gif"
        description="This is the source code of this website, feel free to check it out and understand how it works."
        hoverColor="#7a0fd1"
        href="https://github.com/S42yt/portfolio"
      />
    </CardGrid>
  );
}
