import { useState, useEffect } from "react";
import API from "../services/api";

import { Sidebar } from "../components/Sidebar";
import { ChatWindow } from "../components/ChatWindow";
import { UploadModal } from "../components/UploadModal";
import { GalleryModal } from "../components/GalleryModal";
import { characters } from "../data/characters";

interface Message {
    role: "user" | "assistant";
    text: string;
    sources?: any[];
}

const ChatPage = () => {
    const [selectedLeaderName, setSelectedLeaderName] = useState(characters[0].name);
    
    // Store conversation history individually for each character
    const [conversations, setConversations] = useState<Record<string, Message[]>>({});
    
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // Get current messages for selected character
    const messages = conversations[selectedLeaderName] || [];

    const selectedLeader = characters.find((c) => c.name === selectedLeaderName) || characters[0];

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg = input.trim();
        
        // Optimistically update UI
        setConversations(prev => ({
            ...prev,
            [selectedLeaderName]: [...(prev[selectedLeaderName] || []), { role: "user", text: userMsg }]
        }));
        
        setInput("");
        setIsLoading(true);
        
        try {
            // Map current history for the API, excluding the new userMsg
            const history = messages.map(msg => ({
                role: msg.role,
                content: msg.text
            }));

            const res = await API.post("/chat", {
                prompt: userMsg,
                character: selectedLeaderName,
                history: history
            });

            if (res.data.success) {
                setConversations(prev => ({
                    ...prev,
                    [selectedLeaderName]: [...(prev[selectedLeaderName] || []), { role: "assistant", text: res.data.reply, sources: res.data.sources }]
                }));
            } else {
                throw new Error(res.data.message || "Failed to fetch response");
            }
        } catch (error: any) {
            console.error(error);
            const errorText = error.response?.data?.message || "Sorry, the network is temporarily unreachable. Please try again later.";
            setConversations(prev => ({
                ...prev,
                [selectedLeaderName]: [...(prev[selectedLeaderName] || []), { role: "assistant", text: errorText }]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[100dvh] w-full overflow-hidden bg-transparent font-sans text-slate-100 selection:bg-sky-500/30">
            <Sidebar
                characters={characters}
                selectedLeader={selectedLeaderName}
                onSelectLeader={setSelectedLeaderName}
                onOpenUpload={() => setIsUploadOpen(true)}
                onOpenGallery={() => setIsGalleryOpen(true)}
            />

            <main className="flex-1 relative min-w-0">
                <ChatWindow
                    leader={selectedLeader}
                    messages={messages}
                    isLoading={isLoading}
                    input={input}
                    setInput={setInput}
                    onSend={sendMessage}
                />
            </main>
            
            <UploadModal 
                isOpen={isUploadOpen} 
                onClose={() => setIsUploadOpen(false)} 
                preselectedLeader={selectedLeaderName} 
            />
            
            <GalleryModal 
                isOpen={isGalleryOpen} 
                onClose={() => setIsGalleryOpen(false)} 
                preselectedLeader={selectedLeaderName} 
            />
            
            <style>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
};

export default ChatPage;