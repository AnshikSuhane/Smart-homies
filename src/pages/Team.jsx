import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";

const Team = () => {
  const profiles = [
    {
      name: "Jagganath Seith",
      role: "Full Stack Web Developer",
      avatar: "src/assets/jagannath.jpg",  
      location: "India, Odisha",
      bio: "Full Stack developer focused on building responsive and accessible web applications.",
      skills: ["React", "TypeScript", "UI/UX", "Javascript", "Node.js", "Express.js", "MongoDB"],
      links: {
        github: "https://github.com/jagannathking",
        linkedin: "https://www.linkedin.com/in/jagannath-sethi-849081256/"
      }
    },
    {
      name: "Anshik Suhane",
      role: "Full Stack Web Developer",
      avatar: "src/assets/anshik.jpg",
      location: "India, Madhya Pradesh",
      bio: "Full Stack developer focused on building responsive and accessible web applications.",
      skills: ["Node.js", "Python", "AWS", "React", "TypeScript", "UI/UX", "Javascript", "Express.js", "MongoDB"],
      links: {
        github: "https://github.com/AnshikSuhane",
        linkedin: "https://www.linkedin.com/in/anshik-suhane-003a89316/"
      }
    },
    {
      name: "Srinandan",
      role: "Full Stack Web Developer",
      avatar: "src/assets/srinandan.jpg",
      location: "India, Kerala",
      bio: "Full Stack developer focused on building responsive and accessible web applications.",
      skills: ["Figma", "UI Design", "React", "TypeScript", "UI/UX", "Javascript", "Node.js", "Express.js", "MongoDB"],
      links: {
        github: "https://github.com/Srinandan2003",
        linkedin: "https://linkedin.com/in/emilyc"
      }
    }
  ];

  const handleLinkClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {profiles.map((profile, index) => (
        <Card key={index} className="bg-white dark:bg-gray-900 shadow-lg rounded-xl">
          <CardHeader className="pb-4 flex flex-col md:flex-row md:items-start gap-6">
            <Avatar className="h-20 w-20 ring-2 ring-gray-300 dark:ring-gray-700">
              <AvatarImage src={profile.avatar} alt={profile.name} />
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{profile.name}</h2>
              <p className="text-md text-gray-600 dark:text-gray-300">{profile.role}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <p className="text-gray-700 dark:text-gray-300 mb-4">{profile.bio}</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-3 py-1 rounded-full">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm" onClick={() => handleLinkClick(profile.links.github)} disabled={!profile.links.github}>
                <Github className="h-4 w-4 mr-2" /> GitHub
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleLinkClick(profile.links.linkedin)} disabled={!profile.links.linkedin}>
                <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
              </Button>
              <Button variant="default" size="sm">
                <Mail className="h-4 w-4 mr-2" /> Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Team;
