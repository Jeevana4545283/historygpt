export type BookCategory =
    | "Romance"
    | "Fiction"
    | "Classic Literature"
    | "Mystery & Thriller"
    | "Fantasy"
    | "Young Adult"
    | "Historical Fiction"
    | "Science Fiction"
    | "Inspirational"
    | "Self Improvement"
    | "Motivation"
    | "Productivity"
    | "Leadership"
    | "Career"
    | "Business"
    | "Mindset"
    | "Psychology"
    | "Personal Finance"
    | "Biography";

export interface Book {
    id: string;
    title: string;
    author: string;
    category: BookCategory;
    coverImage: string;
    rating: number;
    reviewsCount: number;
    price: number;
    originalPrice?: number;
    pages: number;
    publishedYear: number;
    quote: string;
    summary: string;
    keyTakeaways: string[];
    chapters: string[];
    authorPersona: {
        name: string;
        role: string;
        avatar: string;
        bio: string;
        greeting: string;
        samplePrompts: string[];
    };
    ragKey: string;
}

export const BOOK_CATEGORIES: BookCategory[] = [
    "Romance",
    "Fiction",
    "Classic Literature",
    "Mystery & Thriller",
    "Fantasy",
    "Young Adult",
    "Historical Fiction",
    "Science Fiction",
    "Inspirational",
    "Self Improvement",
    "Motivation",
    "Productivity",
    "Leadership",
    "Career",
    "Business",
    "Mindset",
    "Psychology",
    "Personal Finance",
    "Biography"
];

export const booksData: Book[] = [
    // --- ROMANCE ---
    {
        id: "pride-and-prejudice",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Romance",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 8420,
        price: 11.99,
        originalPrice: 15.99,
        pages: 279,
        publishedYear: 1813,
        quote: "There is a stubbornness about me that never can bear to be frightened at the will of others. My courage always rises at every attempt to intimidate me.",
        summary: "A timeless romantic classic following Elizabeth Bennet and Fitzwilliam Darcy as they overcome pride, social expectations, and hasty judgments to discover true love.",
        keyTakeaways: [
            "First impressions can be misleading; look deeper into character.",
            "Humility and willingness to self-examine open the heart to genuine connection.",
            "Love flourishes when partners respect each other's independence and intelligence."
        ],
        chapters: [
            "Chapter 1: The Arrival of Mr. Bingley",
            "Chapter 2: The Meryton Assembly Ball",
            "Chapter 3: Netherfield & Pemberley",
            "Chapter 4: Truth, Understanding, and Proposal"
        ],
        authorPersona: {
            name: "Jane Austen",
            role: "Classic English Novelist",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            bio: "Renowned English novelist whose romantic fiction earned her a place as one of the most widely read writers in English literature.",
            greeting: "Good day, dear reader. I am Jane Austen. Shall we converse on matters of human affection, wit, and societal manners?",
            samplePrompts: [
                "What inspired the dynamic between Elizabeth and Mr. Darcy?",
                "What advice do you have on overcoming pride in relationships?",
                "How does 'Pride and Prejudice' portray independent women?"
            ]
        },
        ragKey: "Jane Austen"
    },
    {
        id: "the-notebook",
        title: "The Notebook",
        author: "Nicholas Sparks",
        category: "Romance",
        coverImage: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: 6510,
        price: 14.50,
        originalPrice: 18.99,
        pages: 214,
        publishedYear: 1996,
        quote: "I am who I am because of you. You are every reason, every hope, and every dream I've ever had.",
        summary: "An enduring love story of Noah Calhoun and Allie Nelson, spanning decades of passion, social division, war, and unwavering devotion.",
        keyTakeaways: [
            "True love transcends distance, time, and circumstance.",
            "Memories may fade, but deep emotional connections endure.",
            "Couples who fight for one another build a lifelong bond."
        ],
        chapters: [
            "Chapter 1: Summer in Seabrook",
            "Chapter 2: Letters Across Years",
            "Chapter 3: The Reunion at the Creek",
            "Chapter 4: The Power of Remembering"
        ],
        authorPersona: {
            name: "Nicholas Sparks",
            role: "Bestselling Romance Novelist",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            bio: "American novelist and screenwriter with over 100 million copies sold worldwide in romantic fiction.",
            greeting: "Welcome! I'm Nicholas Sparks. Let's talk about love, destiny, resilience, and emotional storytelling.",
            samplePrompts: [
                "What makes Noah and Allie's bond so powerful?",
                "How do you craft deep emotional connection in romantic stories?",
                "What is the central lesson about commitment in 'The Notebook'?"
            ]
        },
        ragKey: "Nicholas Sparks"
    },

    // --- FICTION & STORIES ---
    {
        id: "the-alchemist",
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 9850,
        price: 13.99,
        originalPrice: 18.00,
        pages: 208,
        publishedYear: 1988,
        quote: "When you want something, all the universe conspires in helping you to achieve it.",
        summary: "An enchanting fable about Santiago, an Andalusian shepherd boy who journeys to the Egyptian pyramids in search of a hidden treasure, discovering his Personal Legend.",
        keyTakeaways: [
            "Listen to your heart and pursue your Personal Legend with courage.",
            "Fear of failure is a greater obstacle than failure itself.",
            "The journey itself reveals the true treasure within."
        ],
        chapters: [
            "Part 1: The Shepherd's Dream & Melchizedek",
            "Part 2: The Crystal Shop in Tangier",
            "Part 3: The Caravan across the Sahara",
            "Part 4: The Alchemist at the Pyramids"
        ],
        authorPersona: {
            name: "Paulo Coelho",
            role: "Visionary Novelist & Mystic",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            bio: "Brazilian lyricist and novelist whose international bestseller 'The Alchemist' has inspired millions worldwide to follow their dreams.",
            greeting: "Greetings my friend. I am Paulo Coelho. What is your Personal Legend, and what signs is the universe sending you today?",
            samplePrompts: [
                "How can I discover my own 'Personal Legend'?",
                "What does 'listening to your heart' mean when facing fear?",
                "Explain the symbolism of the Desert and the Alchemist."
            ]
        },
        ragKey: "Paulo Coelho"
    },
    {
        id: "to-kill-a-mockingbird",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        category: "Fiction",
        coverImage: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 7800,
        price: 12.50,
        originalPrice: 16.99,
        pages: 281,
        publishedYear: 1960,
        quote: "You never really understand a person until you consider things from his point of view... until you climb into his skin and walk around in it.",
        summary: "Set in Maycomb, Alabama, Atticus Finch defends a Black man unjustly accused of a crime, teaching his young daughter Scout about empathy, justice, and moral integrity.",
        keyTakeaways: [
            "Empathy is essential for true justice and human understanding.",
            "Standing up for moral truth requires courage even when the odds are stacked against you.",
            "Prejudice is dismantled through education, compassion, and principled leadership."
        ],
        chapters: [
            "Part 1: Childhood in Maycomb & Boo Radley",
            "Part 2: The Trial of Tom Robinson",
            "Part 3: Atticus's Defense & Moral Lessons",
            "Part 4: The Halloween Walk & True Heroism"
        ],
        authorPersona: {
            name: "Harper Lee",
            role: "Pulitzer Prize-Winning Author",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
            bio: "American novelist widely acclaimed for her Pulitzer Prize-winning masterpiece 'To Kill a Mockingbird'.",
            greeting: "Welcome. I am Harper Lee. Let us reflect on justice, conscience, and walking in another person's shoes.",
            samplePrompts: [
                "What made Atticus Finch such an enduring model of moral courage?",
                "Why is empathy the central theme of 'To Kill a Mockingbird'?",
                "What lessons does Scout learn about human nature?"
            ]
        },
        ragKey: "Harper Lee"
    },

    // --- CLASSIC LITERATURE ---
    {
        id: "1984-george-orwell",
        title: "1984",
        author: "George Orwell",
        category: "Classic Literature",
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 11200,
        price: 13.00,
        originalPrice: 17.50,
        pages: 328,
        publishedYear: 1949,
        quote: "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows.",
        summary: "A chilling dystopian masterpiece exploring total surveillance, government mind control (Big Brother), newspeak, and Winston Smith's desperate quest for truth and freedom.",
        keyTakeaways: [
            "Objective truth and free speech are vital safeguards against authoritarian control.",
            "Controlling language and history alters human thought.",
            "Individuality and critical thinking must be fiercely protected."
        ],
        chapters: [
            "Part 1: Winston Smith & Big Brother's Sight",
            "Part 2: Julia, Love, and The Secret Rebellion",
            "Part 3: Ministry of Love & Room 101"
        ],
        authorPersona: {
            name: "George Orwell",
            role: "Essayist, Journalist & Political Novelist",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
            bio: "English novelist, essayist, and critic whose work is characterized by lucid prose, social criticism, and opposition to totalitarianism.",
            greeting: "Greetings. I am George Orwell. Be vigilant of truth, language, and power. What questions do you have regarding freedom and independent thought?",
            samplePrompts: [
                "What warning does '1984' carry for modern digital society?",
                "How does Newspeak control human perception?",
                "What is the significance of Winston's diary?"
            ]
        },
        ragKey: "George Orwell"
    },

    // --- FANTASY ---
    {
        id: "harry-potter-sorcerers-stone",
        title: "Harry Potter and the Sorcerer's Stone",
        author: "J.K. Rowling",
        category: "Fantasy",
        coverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 15400,
        price: 15.99,
        originalPrice: 21.00,
        pages: 309,
        publishedYear: 1997,
        quote: "It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.",
        summary: "The magical journey of an orphaned boy who discovers his wizarding heritage on his eleventh birthday and attends Hogwarts School of Witchcraft and Wizardry.",
        keyTakeaways: [
            "Friendship, loyalty, and courage overcome darkness.",
            "Our choices define who we are far more than our abilities.",
            "Love is a protective magic deeper than any spell."
        ],
        chapters: [
            "Chapter 1: The Boy Who Lived",
            "Chapter 2: The Keeper of the Keys",
            "Chapter 3: Platform Nine and Three-Quarters",
            "Chapter 4: The Sorcerer's Stone Chamber"
        ],
        authorPersona: {
            name: "J.K. Rowling",
            role: "Author & Creator of the Wizarding World",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
            bio: "British author and philanthropist best known for writing the seven-volume Harry Potter fantasy series.",
            greeting: "Welcome to the world of magic! I am J.K. Rowling. Ask me about Hogwarts, character creation, or overcoming adversity through imagination.",
            samplePrompts: [
                "What inspired the concept of Hogwarts House values?",
                "How does Harry's choice shape his destiny?",
                "What is the role of friendship between Harry, Ron, and Hermione?"
            ]
        },
        ragKey: "JK Rowling"
    },
    {
        id: "the-hobbit",
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        category: "Fantasy",
        coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 9200,
        price: 14.99,
        originalPrice: 19.99,
        pages: 310,
        publishedYear: 1937,
        quote: "There is more in you of good than you know, child of the kindly West. Some courage and some wisdom, blended in measure.",
        summary: "Bilbo Baggins, a comfortable hobbit, is swept into an epic quest with Gandalf and thirteen dwarves to reclaim the Lonely Mountain from the dragon Smaug.",
        keyTakeaways: [
            "Even the smallest person can alter the course of the future.",
            "Courage is discovered when leaving comfort zones.",
            "Greed leads to ruin, whereas generosity and fellowship bring true honor."
        ],
        chapters: [
            "Chapter 1: An Unexpected Party",
            "Chapter 2: Riddles in the Dark & The Ring",
            "Chapter 3: Smaug's Lair at the Lonely Mountain",
            "Chapter 4: The Battle of Five Armies"
        ],
        authorPersona: {
            name: "J.R.R. Tolkien",
            role: "Professor & Architect of Middle-earth",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            bio: "English scholar, philologist, and author of legendary high-fantasy works 'The Hobbit' and 'The Lord of the Rings'.",
            greeting: "Mae govannen! I am J.R.R. Tolkien. Let us talk of lore, mythology, courage, and unexpected adventures.",
            samplePrompts: [
                "How does Bilbo transform from timid hobbit to brave hero?",
                "What inspired the mythology of Middle-earth?",
                "What is the moral lesson behind the dragon's hoard?"
            ]
        },
        ragKey: "JRR Tolkien"
    },

    // --- MYSTERY & THRILLER ---
    {
        id: "sherlock-holmes",
        title: "The Adventures of Sherlock Holmes",
        author: "Arthur Conan Doyle",
        category: "Mystery & Thriller",
        coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: 6400,
        price: 12.99,
        originalPrice: 16.50,
        pages: 307,
        publishedYear: 1892,
        quote: "It is a capital mistake to theorize before one has data. Insensibly one begins to twist facts to suit theories, instead of theories to suit facts.",
        summary: "A classic collection of twelve detective mysteries featuring master detective Sherlock Holmes and Dr. John Watson solving baffling cases through keen observation and deduction.",
        keyTakeaways: [
            "You see, but you do not observe; details carry the key to truth.",
            "Logic and objective deduction must guide problem solving.",
            "Patience and methodical analysis unravel complex problems."
        ],
        chapters: [
            "Story 1: A Scandal in Bohemia",
            "Story 2: The Red-Headed League",
            "Story 3: The Speckled Band",
            "Story 4: The Five Orange Pips"
        ],
        authorPersona: {
            name: "Arthur Conan Doyle",
            role: "Creator of Sherlock Holmes & Physician",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            bio: "Scottish writer and physician who created the character Sherlock Holmes in 1887.",
            greeting: "Good day! I am Sir Arthur Conan Doyle. Put on your thinking cap—what mystery or deduction shall we analyze?",
            samplePrompts: [
                "How does Sherlock Holmes train his observation skills?",
                "What is the secret of deductive reasoning?",
                "Why is Irene Adler so significant in the stories?"
            ]
        },
        ragKey: "Arthur Conan Doyle"
    },

    // --- INSPIRATIONAL, SELF-IMPROVEMENT & MINDSET ---
    {
        id: "atomic-habits",
        title: "Atomic Habits",
        author: "James Clear",
        category: "Productivity",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 12400,
        price: 16.99,
        originalPrice: 22.00,
        pages: 320,
        publishedYear: 2018,
        quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
        summary: "A practical guide on how tiny 1% daily changes compound into monumental personal and professional results using habit stacking, environment design, and identity shifting.",
        keyTakeaways: [
            "Focus on systems rather than just goals.",
            "Shift your identity: focus on becoming the type of person who achieves the result.",
            "Make habits obvious, attractive, easy, and satisfying."
        ],
        chapters: [
            "Chapter 1: The Surprising Power of Atomic Habits",
            "Chapter 2: How Your Habits Shape Your Identity",
            "Chapter 3: The 4 Laws of Behavior Change",
            "Chapter 4: Advanced Tactics: How to Stay Motivated"
        ],
        authorPersona: {
            name: "James Clear",
            role: "Habit Expert & Author",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
            bio: "Writer and speaker focused on habits, decision making, and continuous self-improvement.",
            greeting: "Hey! I'm James Clear. Small habits build big outcomes. What daily habit or system are you building today?",
            samplePrompts: [
                "How do I break a bad habit that keeps recurring?",
                "Explain the concept of 'Identity-Based Habits'.",
                "How can I stay consistent when motivation drops?"
            ]
        },
        ragKey: "James Clear"
    },
    {
        id: "ikigai",
        title: "Ikigai: The Japanese Secret to a Long and Happy Life",
        author: "Héctor García & Francesc Miralles",
        category: "Inspirational",
        coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: 6100,
        price: 14.20,
        originalPrice: 18.50,
        pages: 208,
        publishedYear: 2016,
        quote: "Only staying active will make you want to live a hundred years.",
        summary: "Discovering your 'Ikigai'—the intersection of what you love, what you are good at, what the world needs, and what you can get paid for—inspired by the centenarians of Okinawa.",
        keyTakeaways: [
            "Find joy in daily flow and small meaningful activities.",
            "Nurture strong community bonds and active healthy routines.",
            "Never retire from pursuing purpose and passion."
        ],
        chapters: [
            "Chapter 1: The Art of Staying Young",
            "Chapter 2: Finding Your Purpose at the Intersection",
            "Chapter 3: Lessons from Okinawa Centenarians",
            "Chapter 4: The Ikigai Diet & Gentle Movement"
        ],
        authorPersona: {
            name: "Héctor García",
            role: "Author & Cultural Researcher",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
            bio: "Researcher and writer residing in Japan who explored Okinawa's longevity secrets.",
            greeting: "Konnichiwa! I am Héctor García. Finding your Ikigai brings joy and longevity. What brings you alive?",
            samplePrompts: [
                "How do I find the intersection of my Ikigai?",
                "What daily habits help Okinawan centenarians live past 100?",
                "How does finding purpose reduce stress?"
            ]
        },
        ragKey: "Hector Garcia"
    },
    {
        id: "annihilation-of-caste",
        title: "Annihilation of Caste",
        author: "Dr. B. R. Ambedkar",
        category: "Leadership",
        coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 1420,
        price: 14.99,
        originalPrice: 19.99,
        pages: 176,
        publishedYear: 1936,
        quote: "I measure the progress of a community by the degree of progress which women have achieved.",
        summary: "An undelivered speech written by Dr. B. R. Ambedkar in 1936, addressing social inequities of the caste system in India and advocating for liberty, equality, and fraternity.",
        keyTakeaways: [
            "True reform requires dismantling social hierarchies, not just political freedom.",
            "Reason, morality, and justice must supersede rigid traditions.",
            "Equality and human dignity are non-negotiable rights."
        ],
        chapters: [
            "Chapter 1: The Social Reform Imperative",
            "Chapter 2: Caste vs. Division of Labor",
            "Chapter 3: The Need for Moral Reconstruction",
            "Chapter 4: Liberty, Equality, and Fraternity"
        ],
        authorPersona: {
            name: "Dr. B. R. Ambedkar",
            role: "Chief Architect of the Indian Constitution & Social Reformer",
            avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Bhimrao_Ambedkar.jpg",
            bio: "Jurist, economist, politician, and social reformer who inspired the Dalit Buddhist movement and campaigned against social discrimination.",
            greeting: "Greetings. I am Dr. B.R. Ambedkar. Ask me anything regarding social justice, constitutional law, or the path toward equality and education.",
            samplePrompts: [
                "What is your core vision for social equality in India?",
                "How does 'Annihilation of Caste' address human rights?",
                "What advice do you have for young leaders today?"
            ]
        },
        ragKey: "Dr B. R. Ambedkar"
    },
    {
        id: "wings-of-fire",
        title: "Wings of Fire: An Autobiography",
        author: "Dr. A. P. J. Abdul Kalam",
        category: "Mindset",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 2890,
        price: 16.50,
        originalPrice: 22.00,
        pages: 180,
        publishedYear: 1999,
        quote: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
        summary: "The uplifting autobiography of Dr. A.P.J. Abdul Kalam, tracing his journey from a small town in Rameswaram to becoming India's Missile Man and 11th President.",
        keyTakeaways: [
            "Failure is the First Attempt In Learning (F.A.I.L.).",
            "Passionate vision combined with disciplined perseverance overcomes all barriers.",
            "Youth empowerment is the cornerstone of national prosperity."
        ],
        chapters: [
            "Chapter 1: Orientation & Early Roots in Rameswaram",
            "Chapter 2: Creation & The SLV-3 Rocket Project",
            "Chapter 3: Propulsion & Missile Technology Development",
            "Chapter 4: Contemplation & Vision 2020 for the Nation"
        ],
        authorPersona: {
            name: "Dr. A. P. J. Abdul Kalam",
            role: "Scientist & 11th President of India",
            avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/A._P._J._Abdul_Kalam.jpg",
            bio: "Renowned aerospace scientist who served as President of India, celebrated for his inspirational speeches and devotion to education.",
            greeting: "Welcome, my young friend! I am Dr. A.P.J. Abdul Kalam. What dreams are you nurturing today, and how can science or perseverance help you achieve them?",
            samplePrompts: [
                "How did you overcome failures during the SLV-3 rocket mission?",
                "What is your message to students who want to innovate?",
                "Explain the core philosophy behind 'Wings of Fire'."
            ]
        },
        ragKey: "APJ Abdul Kalam"
    },
    {
        id: "meditations",
        title: "Meditations",
        author: "Marcus Aurelius",
        category: "Self Improvement",
        coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80",
        rating: 4.8,
        reviewsCount: 3100,
        price: 12.99,
        originalPrice: 17.99,
        pages: 256,
        publishedYear: 180,
        quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
        summary: "The private journal of Roman Emperor Marcus Aurelius, offering timeless Stoic wisdom on self-discipline, resilience, virtue, and peace of mind.",
        keyTakeaways: [
            "Focus only on what is within your control; accept what is not.",
            "Obstacles are opportunities to practice virtue and endurance.",
            "Live in alignment with nature and reason."
        ],
        chapters: [
            "Book 1: Debts and Lessons from Ancestors",
            "Book 2: On the River of Time & Duty",
            "Book 4: The Inner Citadel & Mind Mastery",
            "Book 8: Finding Calm Amid Turbulence"
        ],
        authorPersona: {
            name: "Marcus Aurelius",
            role: "Roman Emperor & Stoic Philosopher",
            avatar: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
            bio: "Roman emperor from 161 to 180 AD and Stoic philosopher whose personal journal remains one of the world's greatest works of wisdom.",
            greeting: "Greetings traveler. I am Marcus Aurelius. Tell me, what disturbs your inner peace, and let us examine it through the lens of Stoic reason.",
            samplePrompts: [
                "How can I maintain calm when facing stressful challenges?",
                "What does Stoicism say about dealing with difficult people?",
                "What is the concept of the 'Inner Citadel'?"
            ]
        },
        ragKey: "Marcus Aurelius"
    },
    {
        id: "mans-search-for-meaning",
        title: "Man's Search for Meaning",
        author: "Viktor E. Frankl",
        category: "Psychology",
        coverImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 4200,
        price: 15.20,
        originalPrice: 19.99,
        pages: 200,
        publishedYear: 1946,
        quote: "Everything can be taken from a man but one thing: the last of the human freedoms - to choose one's attitude in any given set of circumstances.",
        summary: "Psychiatrist Viktor Frankl's memoir of surviving Nazi concentration camps, introducing Logotherapy and the human drive to find purpose even in suffering.",
        keyTakeaways: [
            "He who has a why to live can bear almost any how.",
            "Meaning is found in work, love, and courage during hardship.",
            "Attitude is the ultimate human choice."
        ],
        chapters: [
            "Part 1: Experiences in a Concentration Camp",
            "Part 2: Logotherapy in a Nutshell",
            "Part 3: Postscript 1984: The Tragic Optimism"
        ],
        authorPersona: {
            name: "Viktor E. Frankl",
            role: "Psychiatrist, Neurologist & Holocaust Survivor",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
            bio: "Austrian neurologist, psychiatrist and Holocaust survivor who founded Logotherapy, a school of psychotherapy based on finding personal meaning.",
            greeting: "Welcome. I am Viktor Frankl. In every circumstance, no matter how dire, there lies a purpose waiting to be discovered. What meaning are you searching for?",
            samplePrompts: [
                "How do I find purpose when feeling lost or overwhelmed?",
                "What is Logotherapy and how does it differ from traditional therapy?",
                "What sustained your spirit during your hardest moments?"
            ]
        },
        ragKey: "Viktor Frankl"
    },
    {
        id: "steve-jobs-biography",
        title: "Steve Jobs: The Exclusive Biography",
        author: "Walter Isaacson",
        category: "Biography",
        coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
        rating: 4.9,
        reviewsCount: 5120,
        price: 18.99,
        originalPrice: 24.99,
        pages: 656,
        publishedYear: 2011,
        quote: "Stay hungry, stay foolish. Innovation distinguishes between a leader and a follower.",
        summary: "The definitive story of the visionary founder of Apple, exploring product perfectionism, design elegance, the reality distortion field, and revolutionizing technology.",
        keyTakeaways: [
            "Simplicity is the ultimate sophistication.",
            "Focus means saying no to a hundred other good ideas.",
            "Combine technology with liberal arts and humanities."
        ],
        chapters: [
            "Chapter 1: The Counterculture & Apple's Birth",
            "Chapter 2: The NeXT & Pixar Interlude",
            "Chapter 3: The iPhone & Digital Revolution",
            "Chapter 4: Legacy & Stay Hungry, Stay Foolish"
        ],
        authorPersona: {
            name: "Steve Jobs",
            role: "Co-Founder of Apple & Product Pioneer",
            avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Jobs_Headshot_2010-CROP2.jpg",
            bio: "Co-founder, chairman, and CEO of Apple Inc. who transformed personal computing, animated movies, music, phones, and tablet computing.",
            greeting: "Welcome. I'm Steve Jobs. We're here to put a dent in the universe. What product, design, or radical idea are you building?",
            samplePrompts: [
                "What made Apple's design philosophy so unique and simple?",
                "How did you handle getting ousted from Apple and returning stronger?",
                "What does 'Stay Hungry, Stay Foolish' mean to you?"
            ]
        },
        ragKey: "Steve Jobs"
    }
];
