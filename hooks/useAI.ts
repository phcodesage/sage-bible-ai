import { useState, useCallback } from 'react';
import { Message } from '@/types';

export function useAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock responses for different types of questions
  const mockResponses: Record<string, string> = {
    "love": "The Bible speaks extensively about love. 1 Corinthians 13:4-7 tells us that 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.' John 3:16 also famously describes God's love: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.'",
    
    "sermon": "The Sermon on the Mount is one of Jesus' most famous teachings, found in Matthew chapters 5-7. It begins with the Beatitudes ('Blessed are the poor in spirit...') and includes the Lord's Prayer, the Golden Rule, and teachings on subjects like anger, lust, divorce, oaths, loving enemies, giving to the needy, prayer, fasting, worry, judging others, and more. It concludes with the Parable of the Wise and Foolish Builders. The sermon emphasizes the importance of righteousness that exceeds external compliance and instead transforms the heart.",
    
    "disciples": "Jesus had 12 disciples (also called apostles): 1) Simon Peter, 2) Andrew (Peter's brother), 3) James son of Zebedee, 4) John (James' brother), 5) Philip, 6) Bartholomew (also called Nathanael), 7) Thomas, 8) Matthew (the tax collector), 9) James son of Alphaeus, 10) Thaddaeus (also called Judas son of James or Jude), 11) Simon the Zealot, and 12) Judas Iscariot (who betrayed Jesus). After Judas's death, Matthias was chosen to replace him in Acts 1:26.",
    
    "default": "I'd be happy to help answer your question about the Bible. Could you provide more details about what specific aspect of scripture or biblical teachings you're interested in learning about?"
  };
  
  const getResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('love')) {
      return mockResponses.love;
    } else if (lowerQuery.includes('sermon') || lowerQuery.includes('mount')) {
      return mockResponses.sermon;
    } else if (lowerQuery.includes('disciples') || lowerQuery.includes('apostles')) {
      return mockResponses.disciples;
    } else {
      return mockResponses.default;
    }
  };
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getResponse(content),
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  }, []);
  
  return {
    messages,
    sendMessage,
    isLoading
  };
}