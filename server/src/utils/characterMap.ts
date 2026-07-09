/**
 * Centralized mapping of historical character names to their storage folders.
 * This ensures consistency across the ingestion pipeline, media upload controller, and timeline service.
 */
export const CHARACTER_MAP: Record<string, string> = {
    'Albert Einstein': 'einstein',
    'APJ Abdul Kalam': 'kalam',
    'Dr. B. R. Ambedkar': 'ambedkar',
    'Shivaji Maharaj': 'shivaji',
    'Swami Vivekananda': 'vivekananda',
    'Nikola Tesla': 'tesla',
    'Isaac Newton': 'newton',
    'Srinivasa Ramanujan': 'ramanujan',
    'Marie Curie': 'curie',
    'Stephen Hawking': 'hawking',
    'Mahatma Gandhi': 'gandhi',
    'J. J. Thomson': 'thomson',
    'Ernest Rutherford': 'rutherford',
    'Eugen Goldstein': 'goldstein'
};

/**
 * Reverses the CHARACTER_MAP to get a folder-to-name mapping.
 * Used primarily for bulk ingestion.
 */
export const FOLDER_MAP: Record<string, string> = Object.entries(CHARACTER_MAP).reduce(
    (acc, [name, folder]) => {
        acc[folder] = name;
        return acc;
    },
    {} as Record<string, string>
);

/**
 * Helper function to retrieve the folder name associated with a character.
 * Fallback to lowercasing and stripping whitespace if name is not pre-registered.
 */
export const getFolderFromCharacter = (characterName: string): string => {
    return CHARACTER_MAP[characterName] || characterName.toLowerCase().replace(/\s+/g, "");
};
