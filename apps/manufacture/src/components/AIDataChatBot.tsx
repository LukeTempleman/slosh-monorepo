import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Send, 
  User, 
  TrendingUp, 
  Shield, 
  Globe, 
  AlertTriangle,
  DollarSign,
  Package,
  BarChart3,
  MessageCircle,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatSuggestion {
  text: string;
  keywords: string[];
  response: string;
  followUp?: string[];
}

const AIDataChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Mock dashboard data for AI responses
  const dashboardData = {
    totalProducts: 847200,
    authenticatedScans: 324568,
    counterfeitDetected: 1247,
    globalReach: 9,
    revenueProtected: 428000000,
    complianceScore: 97.8,
    topRegions: ["Gauteng", "Western Cape", "KwaZulu-Natal"],
    topProducts: ["Jameson Irish Whiskey", "Chivas Regal 12 Year", "Absolut Vodka"],
    riskAreas: ["Southeast Asia", "Eastern Europe"],
    monthlyGrowth: 12.5
  };

  // Predefined conversation responses based on keywords
  const chatSuggestions: ChatSuggestion[] = [
    {
      text: "What are my key performance metrics?",
      keywords: ["performance", "metrics", "kpi", "key", "stats", "statistics"],
      response: `Here are your key performance metrics:

🏭 **Total Products**: ${dashboardData.totalProducts.toLocaleString()} units
🔍 **Authenticated Scans**: ${dashboardData.authenticatedScans.toLocaleString()} 
🚨 **Counterfeits Detected**: ${dashboardData.counterfeitDetected.toLocaleString()}
🌍 **Global Reach**: ${dashboardData.globalReach} countries
💰 **Revenue Protected**: R${(dashboardData.revenueProtected / 1000000).toFixed(1)}M
✅ **Compliance Score**: ${dashboardData.complianceScore}%

Your authentication rate is ${((dashboardData.authenticatedScans / dashboardData.totalProducts) * 100).toFixed(1)}%, which is excellent!`,
      followUp: ["How can I improve my compliance score?", "Show me regional breakdown", "What's my counterfeit trend?", "Break down authentication by product category", "Show me month-over-month growth"]
    },
    {
      text: "Break down authentication by product category",
      keywords: ["category", "product breakdown", "authentication breakdown", "product categories"],
      response: `Here's your authentication breakdown by product category:

🥃 **Whiskey Category** - 62% of total authentications
• Jameson Irish Whiskey: 48.2K scans (89 counterfeits)
• Chivas Regal 12 Year: 39.1K scans (145 counterfeits)
• Ballantine's 17 Year: 9.2K scans (123 counterfeits)

🍸 **Vodka Category** - 25% of total authentications
• Absolut Vodka: 62.4K scans (234 counterfeits)
• Premium vodka lines showing strong engagement

🍷 **Cognac Category** - 13% of total authentications
• Martell Cordon Bleu: 18.9K scans (67 counterfeits)
• Highest authentication quality scores

**Category Insights:**
• Whiskey dominates with highest consumer engagement
• Vodka shows concerning counterfeit rates requiring attention
• Cognac maintains premium positioning with low fraud rates`,
      followUp: ["Which category needs most attention?", "Show whiskey performance details", "How do I improve vodka security?", "Compare category profitability"]
    },
    {
      text: "How is my regional performance?",
      keywords: ["regional", "region", "country", "geographic", "location", "provinces"],
      response: `Your regional performance analysis:

🏆 **Top Performing Regions:**
1. ${dashboardData.topRegions[0]} - Highest volume and authentication rate
2. ${dashboardData.topRegions[1]} - Strong compliance scores  
3. ${dashboardData.topRegions[2]} - Growing market presence

📊 **Regional Insights:**
• Gauteng leads with 235K products and 98.2% compliance
• Western Cape shows strong authentication rates at 78.2K scans
• KwaZulu-Natal represents significant growth opportunity

Your South African market dominance is strong with consistent performance across all provinces.`,
      followUp: ["Which region needs attention?", "Show product performance by region", "How can I expand to new regions?", "Compare provincial compliance scores", "Show regional counterfeit hotspots"]
    },
    {
      text: "What products are at highest risk?",
      keywords: ["risk", "counterfeit", "fraud", "fake", "threat", "security", "vulnerable"],
      response: `Here's your product risk assessment:

🔴 **High Risk Products:**
• Ballantine's 17 Year - 123 counterfeits detected (High risk level)
• Premium cognac lines showing increased targeting

🟡 **Medium Risk Products:**  
• Chivas Regal 12 Year - 145 counterfeits (Medium risk)
• Absolut Vodka - 234 counterfeits (Medium risk)

🟢 **Low Risk Products:**
• Jameson Irish Whiskey - Only 89 counterfeits (Low risk)
• Martell Cordon Bleu - 67 counterfeits (Low risk)

**Risk Hotspots:** ${dashboardData.riskAreas.join(", ")} showing elevated counterfeit activity.`,
      followUp: ["How do I protect high-risk products?", "Show me counterfeit trends", "What security measures can I implement?", "Analyze premium product vulnerabilities", "Show risk by price point"]
    },
    {
      text: "How is my revenue protection performing?",
      keywords: ["revenue", "money", "financial", "profit", "sales", "income", "protection"],
      response: `Your revenue protection is performing excellently:

💰 **Protected Revenue**: R${(dashboardData.revenueProtected / 1000000).toFixed(1)}M 
📈 **Growth**: +${dashboardData.monthlyGrowth}% this month
🛡️ **Protection Rate**: ${((dashboardData.authenticatedScans / dashboardData.totalProducts) * 100).toFixed(1)}%

**Financial Impact:**
• Prevented an estimated R${((dashboardData.counterfeitDetected * 500) / 1000).toFixed(1)}K in counterfeit losses
• Authentication system ROI: 340% annually
• Brand value protection: Immeasurable

Your investment in NXT technology is delivering strong financial returns and protecting brand integrity.`,
      followUp: ["How do I calculate exact savings?", "Show me cost per authentication", "What's my ROI on security?", "Break down revenue by product line", "Show profit margin protection"]
    },
    {
      text: "How can I improve my authentication rates?",
      keywords: ["improve", "increase", "better", "optimize", "enhance", "authentication"],
      response: `Here are strategies to improve your authentication rates:

📊 **Current Rate**: ${((dashboardData.authenticatedScans / dashboardData.totalProducts) * 100).toFixed(1)}%

🎯 **Improvement Strategies:**

1. **Consumer Education**
   • QR code scanning campaigns
   • Point-of-sale authentication promotions
   • Mobile app user experience improvements

2. **Retailer Engagement**
   • Staff training on authentication benefits
   • Incentive programs for promotion
   • Authentication verification displays

3. **Technology Enhancements**
   • Simplified scanning process
   • Multi-language support
   • Faster response times

4. **Marketing Integration**
   • Authenticity as brand differentiator
   • Social media authentication campaigns
   • Loyalty program integration

Target: Achieve 45%+ authentication rate within 6 months.`,
      followUp: ["Show me best practices", "What's the industry benchmark?", "How do I train retailers?"]
    }
  ];

  useEffect(() => {
    // Quick action suggestions
    const quickSuggestions = [
      "What are my key performance metrics?",
      "How is my regional performance?", 
      "What products are at highest risk?",
      "How is my revenue protection performing?",
      "How can I improve authentication rates?",
      "Break down authentication by product category"
    ];

    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: 'bot',
      content: `👋 Hello! I'm your AI Data Assistant. I can help you understand your manufacturing and authentication data with deep insights and actionable recommendations.

I have access to your current dashboard statistics and can provide detailed analysis on:
• 📊 Performance metrics and KPI breakdowns
• 🌍 Regional analysis and market insights  
• 🔒 Risk assessment and product protection
• 💰 Revenue protection and profitability insights
• 📈 Growth analysis and trends
• 🛡️ Security strategies and improvements

Try asking specific questions or use the suggestions below for detailed insights!`,
      timestamp: new Date(),
      suggestions: quickSuggestions.slice(0, 5)
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages, isTyping]);

  const findBestResponse = (input: string): ChatSuggestion | null => {
    const lowercaseInput = input.toLowerCase();
    let bestMatch: ChatSuggestion | null = null;
    let maxMatches = 0;

    for (const suggestion of chatSuggestions) {
      const matches = suggestion.keywords.filter(keyword => 
        lowercaseInput.includes(keyword.toLowerCase())
      ).length;
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = suggestion;
      }
    }

    return maxMatches > 0 ? bestMatch : null;
  };

  const generateFallbackResponse = (input: string): string => {
    return `I understand you're asking about "${input}". While I don't have a specific response for that exact query, I can provide detailed insights on:

📊 **Performance & Analytics:**
• Key performance metrics and KPI breakdowns
• Authentication rates by product category
• Revenue protection analysis

🌍 **Regional & Market Analysis:**
• Regional performance comparisons
• Risk area identification
• Market insights

🔒 **Risk & Security:**
• Product vulnerability assessment
• Risk mitigation strategies
• Security improvements

Try rephrasing your question or ask about any of these specific areas!`;
  };

  const simulateTyping = async (response: string, followUp?: string[]): Promise<void> => {
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const botMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content: response,
      timestamp: new Date(),
      suggestions: followUp
    };
    
    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || inputValue.trim();
    if (!text) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Find and generate bot response
    const matchedResponse = findBestResponse(text);
    const response = matchedResponse ? matchedResponse.response : generateFallbackResponse(text);
    const followUp = matchedResponse?.followUp;
    
    await simulateTyping(response, followUp);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="h-full max-h-[600px] min-h-[400px] flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          AI Data Assistant
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="h-3 w-3 mr-1" />
            Beta
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask me anything about your manufacturing and authentication data
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-4 min-h-0">
          <div className="space-y-4 pb-4 pt-2">
            {messages.map((message) => (
              <div key={message.id} className={cn(
                "flex gap-3",
                message.type === 'user' ? "justify-end" : "justify-start"
              )}>
                {message.type === 'bot' && (
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 break-words",
                  message.type === 'user' 
                    ? "bg-primary text-primary-foreground ml-12" 
                    : "bg-muted"
                )}>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  <div className="text-xs opacity-70 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-muted-foreground mb-2">💡 Try asking:</p>
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="mr-2 mb-1 h-auto py-1 px-2 text-xs"
                          onClick={() => handleSend(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full flex-shrink-0 mt-1">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input */}
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your data, metrics, or performance..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              onClick={() => handleSend()}
              disabled={!inputValue.trim() || isTyping}
              size="sm"
              className="px-3"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Quick suggestions */}
          <div className="mt-2 flex flex-wrap gap-1">
            {["What are my key metrics?", "Show regional performance", "What products are at risk?", "How do I improve auth rates?"].map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-auto py-1 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => handleSend(suggestion)}
                disabled={isTyping}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIDataChatBot;
