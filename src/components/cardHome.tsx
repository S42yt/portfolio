import CardGrid from "./cardGrid";
import Card from "./card";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';


export default function CardHome() {
    return (
        <CardGrid>        
        <Card
          icon={<FontAwesomeIcon icon={faGithub} className="w-8 h-8" />}
          title="GitHub Profile"
          description="Here you can see my GitHub profile and all my projects i published so far."
          hoverColor="#431266"
          href="https://github.com/S42yt"
        />

      </CardGrid>
    );
}