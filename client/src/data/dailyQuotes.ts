export interface DailyQuote {
    id: string;
    quote: string;
    author: string;
    bookTitle: string;
    bookId: string;
    avatar: string;
    category: string;
    dailyReflection: string;
    ragKey: string;
}

export const dailyQuotesList: DailyQuote[] = [
    {
        id: "dq-1",
        quote: "I measure the progress of a community by the degree of progress which women have achieved.",
        author: "Dr. B. R. Ambedkar",
        bookTitle: "Annihilation of Caste",
        bookId: "annihilation-of-caste",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Bhimrao_Ambedkar.jpg",
        category: "Social Reform & Human Dignity",
        dailyReflection: "True social strength and moral progress are defined by how we uplift and empower every voice.",
        ragKey: "Dr B. R. Ambedkar"
    },
    {
        id: "dq-2",
        quote: "Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.",
        author: "Dr. A. P. J. Abdul Kalam",
        bookTitle: "Wings of Fire",
        bookId: "wings-of-fire",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/A._P._J._Abdul_Kalam.jpg",
        category: "Vision & Inspiration",
        dailyReflection: "Do not let small thinking constrain your potential. Nurture bold vision and back it with relentless daily action.",
        ragKey: "APJ Abdul Kalam"
    },
    {
        id: "dq-3",
        quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
        author: "Marcus Aurelius",
        bookTitle: "Meditations",
        bookId: "meditations",
        avatar: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80",
        category: "Stoicism & Peace of Mind",
        dailyReflection: "External circumstances cannot disrupt your inner calm unless you grant them permission. Focus on your response.",
        ragKey: "Marcus Aurelius"
    },
    {
        id: "dq-4",
        quote: "Everything can be taken from a man but one thing: the last of the human freedoms - to choose one's attitude in any given set of circumstances.",
        author: "Viktor E. Frankl",
        bookTitle: "Man's Search for Meaning",
        bookId: "mans-search-for-meaning",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        category: "Resilience & Purpose",
        dailyReflection: "No hardship can strip away your power to choose your stance. Find your purpose in the challenge.",
        ragKey: "Viktor Frankl"
    },
    {
        id: "dq-5",
        quote: "Arise, awake, and stop not till the goal is reached.",
        author: "Swami Vivekananda",
        bookTitle: "Raja Yoga",
        bookId: "raja-yoga",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Swami_Vivekananda_1893_Scanned_Image.jpg",
        category: "Self-Mastery & Determination",
        dailyReflection: "Shake off hesitation and inertia. Focus your energy single-mindedly until your objective is fulfilled.",
        ragKey: "Swami Vivekananda"
    },
    {
        id: "dq-6",
        quote: "Be the change that you wish to see in the world.",
        author: "Mahatma Gandhi",
        bookTitle: "The Story of My Experiments with Truth",
        bookId: "my-experiments-with-truth",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Portrait_Gandhi.jpg",
        category: "Leadership & Integrity",
        dailyReflection: "Do not wait for others to transform society. Embody the values, kindness, and discipline you desire to see.",
        ragKey: "Mahatma Gandhi"
    },
    {
        id: "dq-7",
        quote: "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
        author: "Albert Einstein",
        bookTitle: "Relativity: The Special and General Theory",
        bookId: "relativity-einstein",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Albert_Einstein_Head.jpg",
        category: "Science & Creativity",
        dailyReflection: "Knowledge tells us what is; creative imagination explores what could be. Dare to dream beyond existing boundaries.",
        ragKey: "Albert Einstein"
    },
    {
        id: "dq-8",
        quote: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        bookTitle: "Steve Jobs: The Exclusive Biography",
        bookId: "steve-jobs-biography",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Steve_Jobs_Headshot_2010-CROP2.jpg",
        category: "Innovation & Excellence",
        dailyReflection: "True leadership comes from questioning status quo assumptions and designing standard-setting experiences.",
        ragKey: "Steve Jobs"
    },
    {
        id: "dq-9",
        quote: "If I have seen further it is by standing on the shoulders of Giants.",
        author: "Isaac Newton",
        bookTitle: "The Principia",
        bookId: "relativity-einstein",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Sir_Isaac_Newton_(1643-1727).jpg",
        category: "Humility & Knowledge",
        dailyReflection: "Acknowledge the wisdom of those who came before you, and build upon their foundation with gratitude.",
        ragKey: "Isaac Newton"
    },
    {
        id: "dq-10",
        quote: "They may kill me, but they cannot kill my ideas. They can crush my body, but they will not be able to crush my spirit.",
        author: "Bhagat Singh",
        bookTitle: "Why I Am an Atheist",
        bookId: "annihilation-of-caste",
        avatar: "https://commons.wikimedia.org/wiki/Special:FilePath/Bhagat_Singh_1929.jpg",
        category: "Courage & Principles",
        dailyReflection: "Ideas grounded in justice and truth outlive physical limitations. Stand firm in your core values.",
        ragKey: "Bhagat Singh"
    }
];

/**
 * Returns today's deterministic daily quote based on the current calendar date.
 * Automatically rotates every day at midnight!
 */
export const getTodayQuote = (): DailyQuote => {
    const today = new Date();
    // Calculate unique day number string (YYYY-MM-DD)
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // Hash date string to get deterministic index
    let hash = 0;
    for (let i = 0; i < dateStr.length; i++) {
        hash = (hash << 5) - hash + dateStr.charCodeAt(i);
        hash |= 0;
    }
    
    const index = Math.abs(hash) % dailyQuotesList.length;
    return dailyQuotesList[index];
};
