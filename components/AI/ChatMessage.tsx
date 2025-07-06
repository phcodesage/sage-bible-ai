import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import Animated, { FadeInRight, FadeInLeft } from 'react-native-reanimated';

interface ChatMessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  };
  isUser: boolean;
}

export default function ChatMessage({ message, isUser }: ChatMessageProps) {
  const { theme } = useTheme();
  
  // Function to parse verse references in AI responses
  const parseVerseReferences = (text: string) => {
    // Simple regex to match common Bible verse formats
    const verseRegex = /(\d?\s*[A-Za-z]+)\s+(\d+):(\d+)(?:-(\d+))?/g;
    
    // Split the text by verse references and create an array of parts
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = verseRegex.exec(text)) !== null) {
      // Add the text before the reference
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }
      
      // Add the verse reference
      parts.push({
        type: 'reference',
        content: match[0],
        book: match[1],
        chapter: match[2],
        startVerse: match[3],
        endVerse: match[4]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add the remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }
    
    return parts;
  };
  
  // Generate the message content with formatted references
  const renderMessageContent = () => {
    if (isUser) {
      return <Text style={styles.messageText}>{message.content}</Text>;
    }
    
    const parts = parseVerseReferences(message.content);
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.type === 'reference') {
            return (
              <Text 
                key={index} 
                style={[styles.verseReference, { color: Colors[theme].tint }]}
              >
                {part.content}
              </Text>
            );
          } else {
            return <Text key={index}>{part.content}</Text>;
          }
        })}
      </>
    );
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
      entering={isUser ? FadeInRight.duration(300) : FadeInLeft.duration(300)}
    >
      <View style={[
        styles.messageBubble,
        isUser 
          ? [styles.userBubble, { backgroundColor: Colors[theme].tint }] 
          : [styles.aiBubble, { backgroundColor: Colors[theme].card }]
      ]}>
        <Text style={[
          styles.messageText,
          { color: isUser ? '#fff' : Colors[theme].text }
        ]}>
          {renderMessageContent()}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 8,
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 22,
  },
  verseReference: {
    fontFamily: 'Inter-SemiBold',
  },
});