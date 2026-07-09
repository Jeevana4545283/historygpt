export interface Character {
    name: string;
    role: string;
    subtitle?: string;
    category: "Leaders" | "Scientists" | "Innovators";
    image: string;
    quote?: string;
    backgroundTheme?: string;
}

export const characters: Character[] = [
    // Leaders
    {
        name: "Shivaji Maharaj",
        role: "Warrior King",
        subtitle: "Maratha Empire",
        category: "Leaders",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Shivaji_British_Museum.jpg",
        quote: "Freedom is a boon, which everyone has the right to receive."
    },
    {
        name: "Dr B. R. Ambedkar",
        role: "Social Reformer & Jurist",
        subtitle: "Father of Indian Constitution",
        category: "Leaders",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bhimrao_Ambedkar.jpg",
        quote: "I measure the progress of a community by the degree of progress which women have achieved."
    },
    {
        name: "Mahatma Gandhi",
        role: "Freedom Fighter",
        subtitle: "Father of the Nation",
        category: "Leaders",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_Gandhi.jpg",
        quote: "Be the change that you wish to see in the world."
    },
    {
        name: "Bhagat Singh",
        role: "Revolutionary",
        subtitle: "Indian Independence",
        category: "Leaders",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bhagat_Singh_1929.jpg",
        quote: "They may kill me, but they cannot kill my ideas."
    },
    {
        name: "Subhas Chandra Bose",
        role: "Nationalist Leader",
        subtitle: "Azad Hind Fauj",
        category: "Leaders",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Subhas_Chandra_Bose_NRB.jpg",
        quote: "Give me blood, and I shall give you freedom!"
    },
    {
        name: "Swami Vivekananda",
        role: "Spiritual Leader",
        subtitle: "Philosopher & Monk",
        category: "Leaders",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Swami_Vivekananda_1893_Scanned_Image.jpg",
        quote: "Arise, awake, and stop not till the goal is reached."
    },

    // Scientists
    {
        name: "Albert Einstein",
        role: "Theoretical Physicist",
        subtitle: "Theory of Relativity",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Albert_Einstein_Head.jpg",
        quote: "Imagination is more important than knowledge."
    },
    {
        name: "Isaac Newton",
        role: "Mathematician & Physicist",
        subtitle: "Laws of Motion",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_Isaac_Newton_(1643-1727).jpg",
        quote: "If I have seen further it is by standing on the shoulders of Giants."
    },
    {
        name: "Nikola Tesla",
        role: "Inventor & Engineer",
        subtitle: "Alternating Current",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/N.Tesla.JPG",
        quote: "The present is theirs; the future, for which I really worked, is mine."
    },
    {
        name: "Stephen Hawking",
        role: "Theoretical Physicist",
        subtitle: "Cosmology & Black Holes",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Hawking.StarChild.jpg",
        quote: "Intelligence is the ability to adapt to change."
    },
    {
        name: "Galileo Galilei",
        role: "Astronomer & Physicist",
        subtitle: "Father of Observational Astronomy",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Galileo.arp.300pix.jpg",
        quote: "And yet it moves."
    },
    {
        name: "Johannes Kepler",
        role: "Astronomer & Mathematician",
        subtitle: "Laws of Planetary Motion",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Johannes_Kepler_1610.jpg",
        quote: "Nature uses as little as possible of anything."
    },
    {
        name: "Carl Sagan",
        role: "Astronomer & Planetary Scientist",
        subtitle: "Cosmos & Science Communication",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Carl_Sagan_Planetary_Society.JPG",
        quote: "Somewhere, something incredible is waiting to be known."
    },
    {
        name: "APJ Abdul Kalam",
        role: "Scientist & President",
        subtitle: "Missile Man of India",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/A._P._J._Abdul_Kalam.jpg",
        quote: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action."
    },
    {
        name: "C. V. Raman",
        role: "Physicist",
        subtitle: "Raman Effect",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/C_V_Raman.jpg",
        quote: "I am the master of my failure."
    },
    {
        name: "Homi J. Bhabha",
        role: "Nuclear Physicist",
        subtitle: "Indian Nuclear Programme",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Homi_Jehangir_Bhabha_1960s.jpg",
        quote: "For, each man can do best and excel in only that thing of which he is passionately fond."
    },
    {
        name: "Vikram Sarabhai",
        role: "Physicist & Astronomer",
        subtitle: "Indian Space Program",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Vikram_Sarabhai.jpg",
        quote: "He who can listen to the music in the midst of noise can achieve great things."
    },
    {
        name: "Jagadish Chandra Bose",
        role: "Polymath & Biologist",
        subtitle: "Plant Physiology & Radio Waves",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/J.C.Bose.JPG",
        quote: "The true laboratory is the mind."
    },
    {
        name: "Srinivasa Ramanujan",
        role: "Mathematician",
        subtitle: "Number Theory",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Srinivasa_Ramanujan_-_OPC_-_1.jpg",
        quote: "An equation for me has no meaning, unless it expresses a thought of God."
    },
    {
        name: "Alan Turing",
        role: "Computer Scientist",
        subtitle: "Theoretical Computer Science",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Alan_Turing_Aged_16.jpg",
        quote: "Sometimes it is the people no one can imagine anything of who do the things no one can imagine."
    },
    {
        name: "Ada Lovelace",
        role: "Mathematician & Writer",
        subtitle: "First Computer Programmer",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ada_Lovelace_portrait.jpg",
        quote: "That brain of mine is something more than merely mortal."
    },
    {
        name: "John von Neumann",
        role: "Mathematician & Polymath",
        subtitle: "Game Theory & Computer Architecture",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/John_von_Neumann.jpg",
        quote: "If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is."
    },
    {
        name: "Marie Curie",
        role: "Physicist & Chemist",
        subtitle: "Radioactivity Research",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Marie_Curie_c1920.jpg",
        quote: "Nothing in life is to be feared, it is only to be understood."
    },
    {
        name: "Charles Darwin",
        role: "Naturalist",
        subtitle: "Theory of Evolution",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Charles_Darwin_seated_crop.jpg",
        quote: "It is not the strongest of the species that survives, nor the most intelligent, but the one most responsive to change."
    },
    {
        name: "Louis Pasteur",
        role: "Chemist & Microbiologist",
        subtitle: "Vaccination & Pasteurization",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Louis_Pasteur_by_Nadar_retouched.jpg",
        quote: "Science knows no country, because knowledge belongs to humanity."
    },
    {
        name: "Rosalind Franklin",
        role: "Chemist & X-ray Crystallographer",
        subtitle: "DNA Structure Discovery",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Rosalind_Franklin_(1920-1958).jpg",
        quote: "Science and everyday life cannot and should not be separated."
    },
    {
        name: "J. J. Thomson",
        role: "Physicist",
        subtitle: "Discovery of the Electron",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/J.J._Thomson.jpg",
        quote: "To the electron: may it never be of any use to anybody!"
    },
    {
        name: "Ernest Rutherford",
        role: "Physicist",
        subtitle: "Father of Nuclear Physics",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Ernest_Rutherford_1908.jpg",
        quote: "All science is either physics or stamp collecting."
    },
    {
        name: "Eugen Goldstein",
        role: "Physicist",
        subtitle: "Discovery of Canal Rays & Protons",
        category: "Scientists",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Eugen_Goldstein_1913.jpg",
        quote: "As the rays of light travel in straight lines, so also do the rays of electricity."
    },

    // Innovators / Tech Legends
    {
        name: "Steve Jobs",
        role: "Entrepreneur & Designer",
        subtitle: "Co-founder of Apple",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Jobs_Headshot_2010-CROP2.jpg",
        quote: "Innovation distinguishes between a leader and a follower."
    },
    {
        name: "Bill Gates",
        role: "Entrepreneur & Philanthropist",
        subtitle: "Co-founder of Microsoft",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Bill_Gates_2017_(cropped).jpg",
        quote: "Software is a great combination between artistry and engineering."
    },
    {
        name: "Tim Berners-Lee",
        role: "Computer Scientist",
        subtitle: "Inventor of the World Wide Web",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_Tim_Berners-Lee_(cropped).jpg",
        quote: "The Web as I envisaged it, we have not seen it yet."
    },
    {
        name: "Dennis Ritchie",
        role: "Computer Scientist",
        subtitle: "Creator of C & Unix",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Dennis_Ritchie_2011.jpg",
        quote: "UNIX is very simple, it just needs a genius to understand its simplicity."
    },
    {
        name: "Leonardo da Vinci",
        role: "Polymath",
        subtitle: "Art & Engineering",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Leonardo_da_Vinci_-_presumed_self-portrait_-_WGA12798.jpg",
        quote: "Learning never exhausts the mind."
    },
    {
        name: "Linus Torvalds",
        role: "Software Engineer",
        subtitle: "Creator of Linux & Git",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Linus_Torvalds_talks_about_Git_at_Google.jpg",
        quote: "Talk is cheap. Show me the code."
    },
    {
        name: "Larry Page",
        role: "Entrepreneur & Computer Scientist",
        subtitle: "Co-founder of Google",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Larry_Page_in_2009.jpg",
        quote: "Always deliver more than expected."
    },
    {
        name: "Guido van Rossum",
        role: "Software Developer",
        subtitle: "Creator of Python",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Guido_van_Rossum_OSCON_2006.jpg",
        quote: "Python is an experiment in how much freedom programmers need."
    },
    {
        name: "Grace Hopper",
        role: "Computer Scientist & Navy Rear Admiral",
        subtitle: "Pioneer of Compilers & COBOL",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Grace_Hopper.jpg",
        quote: "The most dangerous phrase in the language is, 'We've always done it this way.'"
    },
    {
        name: "Mark Zuckerberg",
        role: "Entrepreneur & Software Developer",
        subtitle: "Co-founder of Facebook / Meta",
        category: "Innovators",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Mark_Zuckerberg_F8_2019_Keynote_-_Crop.jpg",
        quote: "Move fast and break things."
    }
];
