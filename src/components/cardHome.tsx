import CardGrid from "./cardGrid";
import Card from "./card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faTwitch, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faUser, faCodeBranch } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export const ImageIcons = {
  tradeCycle: "/icons/trade-cycle.png",
  biogg: "/icons/biogg.png",
  nrc: "/icons/nrc.png",
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
        <Image
        src={ImageIcons.tradeCycle}
        width={32}
        height={32}
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
      icon={
        <Image src={ImageIcons.biogg} width={32} height={32} alt="Burnt" />
      }
      title="Burnt"
      image="emojis/kuromi_snort.gif"
      description="Burnt is a bio page i worked on and still use till this day."
      hoverColor="#A41212"
      route="/burnt"
      />

      <Card
      icon={
        <Image
        src={ImageIcons.cutecraft}
        width={32}
        height={32}
        alt="CuteCraft"
        />
      }
      title="CuteCraft"
      image="emojis/kuromi_laugh.gif"
      description="CuteCraft is a German Minecraft CityBuild network where i mainly focus on the websites and designs of the items."
      hoverColor="#F3A5BE"
      route="/cutecraft"
      />

      <Card
      icon={
        <Image
        src={ImageIcons.nrc}
        width={32}
        height={32}
        alt="NoRisk Client"
        />
      }
      title="NoRisk Client"
      image="emojis/kuromi_ghost.gif"
      description="NoRisk Client is a Minecraft client with community in the foreground."
      hoverColor="#42D1CD"
      route="/nrc"
      />

      <Card
      icon={<FontAwesomeIcon icon={faTwitch} className="w-8 h-8 text-[#9146FF]" />}
      title="Worked For"
      image="emojis/kuromi_twerk.gif"
      description="Big names i worked for."
      hoverColor="#42D1CD"
      route="/worked-for"
      />

      <Card
      icon={<FontAwesomeIcon icon={faCodeBranch} className="w-8 h-8" />}
      title="Source Code"
      image="emojis/kuromi_blush.gif"
      description="This is the source code of this website, feel free to check it out and understand how it works."
      hoverColor="#9C1EE9"
      href="https://github.com/S42yt/portfolio"
      />
    </CardGrid>
  );
}
