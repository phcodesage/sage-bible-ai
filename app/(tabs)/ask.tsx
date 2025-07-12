import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import ChatMessage from '@/components/AI/ChatMessage';
import { useAI } from '@/hooks/useAI';

export default function AskScreen() {
  const [message, setMessage] = useState('');
  const { theme } = useTheme();
  const scrollViewRef = useRef(null);
  const { messages, sendMessage, isLoading } = useAI();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <ActivityIndicator size="large" color={Colors[theme].tint} />
      </View>
    );
  }

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      sendMessage(message);
      setMessage('');
    }
  };

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      (scrollViewRef.current as ScrollView).scrollToEnd({ animated: true });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>
            Bible AI Assistant
          </Text>
          <Text style={[styles.headerSubtitle, { color: Colors[theme].textSecondary }]}>
            Ask questions about Bible topics
          </Text>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.chatContainer}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={scrollToBottom}
        >
          {messages.length === 0 ? (
            <View style={styles.welcomeContainer}>
              <Text style={[styles.welcomeTitle, { color: Colors[theme].text }]}>
                Welcome to Sage Bible AI
              </Text>
              <Text style={[styles.welcomeText, { color: Colors[theme].textSecondary }]}>
                Ask me any question about the Bible, theology, biblical history, or related topics.
              </Text>
              <View style={styles.suggestionsContainer}>
                <TouchableOpacity 
                  style={[styles.suggestionButton, 
                    { backgroundColor: Colors[theme].card }
                  ]}
                  onPress={() => sendMessage("What does the Bible say about love?")}
                >
                  <Text style={[styles.suggestionText, { color: Colors[theme].text }]}>
                    What does the Bible say about love?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.suggestionButton, 
                    { backgroundColor: Colors[theme].card }
                  ]}
                  onPress={() => sendMessage("Explain the Sermon on the Mount")}
                >
                  <Text style={[styles.suggestionText, { color: Colors[theme].text }]}>
                    Explain the Sermon on the Mount
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.suggestionButton, 
                    { backgroundColor: Colors[theme].card }
                  ]}
                  onPress={() => sendMessage("Who were the 12 disciples?")}
                >
                  <Text style={[styles.suggestionText, { color: Colors[theme].text }]}>
                    Who were the 12 disciples?
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage 
                key={index}
                message={msg}
                isUser={msg.role === 'user'}
              />
            ))
          )}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors[theme].tint} />
              <Text style={[styles.loadingText, { color: Colors[theme].textSecondary }]}>
                Thinking...
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={[
          styles.inputContainer, 
          { backgroundColor: Colors[theme].card }
        ]}>
          <TextInput
            style={[styles.input, { color: Colors[theme].text }]}
            placeholder="Ask about the Bible..."
            placeholderTextColor={Colors[theme].textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: Colors[theme].tint },
              message.trim().length === 0 && styles.disabledButton
            ]} 
            onPress={handleSend}
            disabled={message.trim().length === 0 || isLoading}
          >
            <Feather name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatContent: {
    paddingBottom: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  welcomeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
    lineHeight: 22,
  },
  suggestionsContainer: {
    width: '100%',
    gap: 10,
  },
  suggestionButton: {
    padding: 15,
    borderRadius: 12,
  },
  suggestionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  loadingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
});