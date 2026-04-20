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
      text: "Show whiskey performance details",
      keywords: ["whiskey details", "whiskey performance", "jameson", "chivas", "ballantine"],
      response: `🥃 **Detailed Whiskey Category Analysis:**

**Top Performers:**
1. **Jameson Irish Whiskey**
   • Volume: 125K units produced
   • Scans: 48.2K (38.6% authentication rate)
   • Risk Level: Low (89 counterfeits = 0.18% of scans)
   • Revenue Impact: R45.2M protected
   • Consumer Trust: 96.8% positive feedback

2. **Chivas Regal 12 Year**
   • Volume: 98K units produced  
   • Scans: 39.1K (39.9% authentication rate)
   • Risk Level: Medium (145 counterfeits = 0.37% of scans)
   • Revenue Impact: R78.5M protected
   • Market Position: Premium segment leader

3. **Ballantine's 17 Year**
   • Volume: 23K units produced
   • Scans: 9.2K (40% authentication rate)
   • Risk Level: High (123 counterfeits = 1.34% of scans)
   • Revenue Impact: R34.1M protected
   • Alert: Requires immediate attention

**Whiskey Category Recommendations:**
• Increase security measures for Ballantine's 17 Year
• Leverage Jameson's strong performance for brand campaigns
• Monitor Chivas Regal distribution channels`,
      followUp: ["How do I secure Ballantine's 17 Year?", "Show Jameson success factors", "Compare with industry benchmarks", "Regional whiskey performance"]
    },
    {
      text: "How do I secure Ballantine's 17 Year?",
      keywords: ["secure ballantine", "ballantine security", "high risk product", "protect premium"],
      response: `🔒 **Security Strategy for Ballantine's 17 Year:**

**Immediate Actions (Next 30 Days):**
• Enhanced NXT tag verification for all new batches
• Implement batch-level tracking with unique identifiers
• Partner verification program for premium retailers
• Consumer education campaign about authentication

**Medium-term Improvements (3 Months):**
• Advanced holographic security features
• Dedicated authentication app features for premium products
• Retailer training program with certification
• Supply chain audit for distribution partners

**Long-term Strategy (6-12 Months):**
• Blockchain-based provenance tracking
• AI-powered pattern recognition for fraud detection
• Premium customer loyalty program with authentication rewards
• International distributor security compliance program

**Expected Outcomes:**
• Reduce counterfeit rate from 1.34% to <0.5%
• Increase authentication rate from 40% to 55%
• Protect additional R12M in revenue annually
• Strengthen brand premium positioning

**Budget Estimate:** R2.3M implementation cost with 340% ROI`,
      followUp: ["Show me implementation timeline", "What's the cost breakdown?", "How do I measure success?", "Compare with other premium brands"]
    },
    {
      text: "Show me implementation timeline",
      keywords: ["timeline", "implementation", "schedule", "roadmap", "plan"],
      response: `📅 **Security Implementation Timeline:**

**Phase 1: Immediate Response (Weeks 1-4)**
Week 1-2:
• Audit current Ballantine's 17 Year inventory
• Identify high-risk distribution channels
• Deploy enhanced NXT tags to new production

Week 3-4:
• Launch retailer notification program
• Begin consumer awareness campaign
• Implement batch tracking system

**Phase 2: Enhanced Security (Weeks 5-12)**
Month 2:
• Roll out retailer training program
• Deploy advanced authentication features
• Begin supply chain partner audits

Month 3:
• Launch premium authentication app features
• Implement holographic security elements
• Complete distributor compliance reviews

**Phase 3: Advanced Protection (Months 4-6)**
• Deploy blockchain tracking pilot
• Launch AI fraud detection system
• Implement loyalty program integration
• Complete global rollout

**Phase 4: Optimization (Months 7-12)**
• Monitor and refine all systems
• Scale successful pilots globally
• Continuous improvement based on data
• Prepare next-generation security features

**Key Milestones:**
✅ Week 4: Immediate security measures active
🎯 Month 3: Enhanced protection deployed
🚀 Month 6: Advanced systems operational
📊 Month 12: Full optimization achieved`,
      followUp: ["What are the critical dependencies?", "Show me resource requirements", "How do I track progress?", "What are the risk factors?"]
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
      text: "Show regional counterfeit hotspots",
      keywords: ["regional counterfeits", "hotspots", "counterfeit regions", "fraud regions"],
      response: `🚨 **Regional Counterfeit Analysis:**

**High-Risk Regions:**
🔴 **Eastern Cape** (98 counterfeits detected)
• Border province vulnerability
• Emerging market with limited authentication awareness
• Recommendation: Increase retailer education programs

🔴 **Limpopo** (45 counterfeits detected)  
• Rural distribution challenges
• Cross-border smuggling concerns
• Recommendation: Enhanced supply chain monitoring

**Medium-Risk Regions:**
🟡 **Mpumalanga** (67 counterfeits)
• Tourism-related counterfeit activity
• Mixed urban/rural distribution
• Action: Tourist area retailer partnerships

**Low-Risk Regions:**
🟢 **Northern Cape** (18 counterfeits)
• Limited distribution network = better control
• High compliance scores (98.8%)
• Model for expansion strategy

**Counterfeit Trend Analysis:**
• 23% decrease in counterfeits over last quarter
• Urban areas show better authentication rates
• Border regions require enhanced monitoring

**Recommended Actions:**
1. Deploy mobile authentication units to high-risk areas
2. Strengthen distributor verification in Eastern Cape
3. Consumer education campaigns in rural areas`,
      followUp: ["How do I improve Eastern Cape security?", "Show border security measures", "What's the cost of rural education?", "Compare with national averages"]
    },
    {
      text: "How do I improve Eastern Cape security?",
      keywords: ["eastern cape", "improve security", "border security", "rural protection"],
      response: `🛡️ **Eastern Cape Security Enhancement Plan:**

**Current Challenge:**
• 98 counterfeits detected (highest provincial count)
• 87.5K products in distribution
• 28.9K authentication scans (33% rate)
• Border vulnerability with high smuggling risk

**Immediate Actions (30 Days):**
🎯 **Retailer Partnership Program**
• Identify and certify 50 key retailers
• Provide authentication training and tools
• Establish verification reward system
• Cost: R245K, Expected Impact: 40% fraud reduction

🎯 **Border Control Collaboration**
• Partner with SARS customs for import monitoring
• Implement cross-border verification protocols
• Share counterfeit intelligence
• Cost: R89K, Expected Impact: 60% import fraud reduction

**Strategic Initiatives (90 Days):**
🚀 **Mobile Authentication Units**
• Deploy 3 mobile verification teams
• Rural area outreach and education
• Pop-up authentication centers at markets
• Cost: R567K, Expected Impact: 200% scan increase

🚀 **Distribution Network Audit**
• Complete supply chain verification
• Implement distributor security protocols
• GPS tracking for high-value shipments
• Cost: R123K, Expected Impact: 35% supply chain fraud reduction

**Success Metrics:**
• Reduce counterfeits from 98 to <40 (60% reduction)
• Increase authentication rate from 33% to 50%
• Achieve 95%+ compliance score
• Protect additional R8.7M in revenue

**Total Investment:** R1.024M with estimated 520% ROI`,
      followUp: ["Show me the mobile unit details", "What's the distributor audit process?", "How do I measure success?", "Compare with other provinces"]
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
      text: "Analyze premium product vulnerabilities",
      keywords: ["premium vulnerabilities", "luxury security", "high-value protection", "premium risk"],
      response: `🏆 **Premium Product Vulnerability Analysis:**

**Why Premium Products Are Targeted:**
💰 **High Profit Margins** - 300-500% markup makes counterfeiting profitable
🎯 **Brand Recognition** - Well-known brands easier to sell
💎 **Limited Supply** - Scarcity increases market demand
🛡️ **Security Gaps** - Complex distribution chains create vulnerabilities

**Vulnerability Assessment by Product:**

**🥃 Ballantine's 17 Year (Critical Risk)**
• Price Point: R2,400+ per bottle
• Counterfeit Rate: 1.34% (Industry avg: 0.8%)
• Primary Vulnerabilities:
  - Luxury packaging easy to replicate
  - Limited production creates supply gaps
  - High-end restaurant/bar distribution
  - Cross-border gray market activity

**🍷 Martell Cordon Bleu (Moderate Risk)**
• Price Point: R1,800+ per bottle
• Counterfeit Rate: 0.35% (Below industry avg)
• Strengths: Complex bottle design, established supply chain
• Vulnerabilities: Duty-free channel exposure

**🥃 Chivas Regal 12 Year (Moderate Risk)**
• Price Point: R950+ per bottle
• Counterfeit Rate: 0.37%
• Main Risk: Wide distribution increases exposure points

**Protection Strategies by Risk Level:**
🔴 **Critical**: Enhanced authentication + blockchain tracking
🟡 **Moderate**: Strengthened supply chain + retailer training
🟢 **Low**: Standard monitoring + consumer education`,
      followUp: ["How do I protect luxury distribution?", "Show duty-free security measures", "What's blockchain tracking cost?", "Compare with competitor security"]
    },
    {
      text: "Show duty-free security measures",
      keywords: ["duty free", "airport security", "travel retail", "border protection"],
      response: `✈️ **Duty-Free & Travel Retail Security Framework:**

**Current Duty-Free Performance:**
• 156 duty-free locations globally
• R89.3M in annual duty-free sales
• 12% of total counterfeit incidents occur in travel retail
• Average authentication rate: 28% (below standard 38%)

**Security Challenges:**
🚨 **High-Risk Factors:**
• International traveler anonymity
• Multiple jurisdiction complexities
• Quick transaction times limit verification
• Gray market parallel imports
• Staff turnover and training gaps

**Enhanced Security Measures:**

**🛡️ Level 1: Authentication Integration**
• QR code scanners at all duty-free counters
• Staff training on authentication protocols
• Customer education displays
• Real-time verification alerts
• Implementation Cost: R890K

**🛡️ Level 2: Supply Chain Verification**
• Direct-from-distillery shipping only
• Blockchain tracking for travel retail
• Certified distributor partnerships
• Temperature and handling monitoring
• Implementation Cost: R1.2M

**🛡️ Level 3: Advanced Protection**
• AI-powered transaction monitoring
• Customer behavior analysis
• Cross-border intelligence sharing
• Biometric staff access controls
• Implementation Cost: R2.1M

**Expected Outcomes:**
• Reduce duty-free counterfeits by 75%
• Increase authentication rate to 45%
• Protect R67M additional revenue annually
• Strengthen brand integrity in premium channels

**ROI Analysis:** 340% return within 18 months across all protection levels`,
      followUp: ["What's the staff training program?", "How does blockchain work for travel retail?", "Show airport partnership details", "Compare duty-free vs retail security"]
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
      text: "Break down revenue by product line",
      keywords: ["revenue breakdown", "product revenue", "line profitability", "financial breakdown"],
      response: `💰 **Revenue Breakdown by Product Line:**

**🥃 Whiskey Portfolio - R267.4M (62.5% of total)**
1. **Jameson Irish Whiskey**: R112.8M
   • Volume: 125K units × R902 avg price
   • Margin: 68% (Industry leading)
   • Growth: +15.2% YoY

2. **Chivas Regal 12 Year**: R89.7M  
   • Volume: 98K units × R915 avg price
   • Margin: 71% (Premium positioning)
   • Growth: +8.4% YoY

3. **Ballantine's 17 Year**: R64.9M
   • Volume: 23K units × R2,822 avg price
   • Margin: 76% (Ultra-premium)
   • Growth: +22.1% YoY (highest growth)

**🍸 Vodka Portfolio - R106.8M (25% of total)**
• **Absolut Vodka**: R106.8M
• Volume: 156K units × R685 avg price
• Margin: 58% (Mass premium)
• Growth: +6.7% YoY

**🍷 Cognac Portfolio - R53.8M (12.5% of total)**
• **Martell Cordon Bleu**: R53.8M
• Volume: 45K units × R1,195 avg price  
• Margin: 72% (Luxury positioning)
• Growth: +11.3% YoY

**Key Financial Insights:**
• Ultra-premium products drive 43% of profit despite 11% of volume
• Whiskey segment shows strongest brand loyalty and margin protection
• Vodka requires volume strategy to maintain market share
• Cognac represents highest margin opportunity for expansion`,
      followUp: ["How do I improve vodka margins?", "Show ultra-premium growth strategy", "What's driving Ballantine's growth?", "Compare with industry benchmarks"]
    },
    {
      text: "What's driving Ballantine's growth?",
      keywords: ["ballantine growth", "premium growth", "luxury performance", "growth drivers"],
      response: `🚀 **Ballantine's 17 Year Growth Analysis:**

**Exceptional Performance Metrics:**
• **Revenue Growth**: +22.1% YoY (vs industry avg 8.3%)
• **Volume Growth**: +18.7% YoY  
• **Price Premium**: +2.9% increase accepted by market
• **Market Share**: Gained 1.8% in ultra-premium segment

**Key Growth Drivers:**

**📊 Market Dynamics (40% of growth)**
• Global whiskey premiumization trend
• Emerging market appetite for aged spirits
• Limited edition releases creating scarcity value
• Collector market development

**🎯 Marketing Excellence (25% of growth)**
• Targeted affluent consumer campaigns
• Premium experiential marketing events
• Influencer partnerships in luxury lifestyle
• Authentication as premium brand differentiator

**🛡️ Authentication Impact (20% of growth)**
• Consumer confidence through NXT verification
• Premium positioning strengthened by security
• Retailer preference for protected products
• Reduced gray market competition

**🌍 Geographic Expansion (15% of growth)**
• Entry into 3 new premium markets
• Duty-free channel optimization
• High-end restaurant partnerships
• Private club exclusive arrangements

**Risks to Monitor:**
⚠️ **High counterfeit rate (1.34%) threatens brand integrity**
⚠️ **Supply constraints limiting growth potential**
⚠️ **Economic downturn could impact luxury spending**

**Recommendations:**
1. Accelerate security measures to protect growth
2. Increase production capacity for sustained growth
3. Develop exclusive limited editions for collectors`,
      followUp: ["How do I scale Ballantine's production?", "Show luxury market expansion plan", "What security measures protect growth?", "Compare with other ultra-premium brands"]
    },
    {
      text: "What are my compliance alerts?",
      keywords: ["compliance", "alerts", "warnings", "issues", "problems", "violations"],
      response: `Current compliance status and alerts:

✅ **Overall Compliance**: ${dashboardData.complianceScore}% (Excellent)

🚨 **Active Alerts:**
• High counterfeit activity in Southeast Asia region
• Unusual scanning pattern detected for Batch JW-2024-001
• Authentication server response time monitoring

⚠️ **Upcoming Requirements:**
• New EU regulatory requirements effective Feb 1st
• Enhanced traceability standards in development

**Action Items:**
1. Review Southeast Asia distribution channels
2. Investigate Batch JW-2024-001 patterns  
3. Prepare for EU compliance updates`,
      followUp: ["How do I resolve these alerts?", "Show me compliance history", "What are the new EU requirements?", "Investigate batch scanning patterns", "Show compliance by region"]
    },
    {
      text: "Investigate batch scanning patterns",
      keywords: ["batch patterns", "scanning patterns", "unusual activity", "batch investigation"],
      response: `🔍 **Batch JW-2024-001 Investigation Results:**

**Batch Details:**
• Product: Jameson Irish Whiskey
• Production Date: January 15, 2024
• Batch Size: 12,500 units
• Distribution: 15 countries, 89 retailers

**Unusual Pattern Detected:**
🚨 **Anomaly**: 847 scans in 6 hours (Jan 28, 14:00-20:00 UTC)
• Normal rate: 25-40 scans per day
• Location: Multiple IP addresses from Eastern Europe
• Pattern: Systematic scanning every 30 seconds

**Investigation Findings:**

**🎯 Root Cause Analysis:**
• **Counterfeit Operation Discovered**: Organized group testing fake products
• **Location**: Romania and Bulgaria distribution network
• **Method**: Mass scanning to identify security vulnerabilities
• **Scale**: Estimated 2,300 fake units in circulation

**🛡️ Response Actions Taken:**
1. **Immediate**: Blacklisted suspicious IP addresses
2. **Supply Chain**: Notified Eastern European distributors  
3. **Enforcement**: Reported to international enforcement agencies
4. **Security**: Enhanced batch verification protocols

**📊 Impact Assessment:**
• Prevented: R4.2M in potential counterfeit sales
• Protected: Brand integrity in European markets
• Identified: 12 compromised retail locations
• Enhanced: Security protocols across all batches

**Current Status:** ✅ Resolved - Enhanced monitoring active

**Lessons Learned:**
• Real-time pattern detection saved millions in losses
• Cross-border collaboration essential for enforcement
• Batch-level tracking provides powerful forensic capabilities`,
      followUp: ["Show me real-time monitoring setup", "How do I prevent future attacks?", "What's the enforcement follow-up?", "Show security protocol enhancements"]
    },
    {
      text: "Show security protocol enhancements",
      keywords: ["security protocols", "enhanced security", "protection improvements", "security upgrades"],
      response: `🛡️ **Enhanced Security Protocol Framework:**

**🔄 Real-Time Monitoring Upgrades:**

**Level 1: Pattern Detection**
• AI-powered anomaly detection (deployed)
• Threshold alerts for unusual scanning volumes
• Geographic clustering analysis
• Time-based pattern recognition
• **Status**: ✅ Active across all products

**Level 2: Behavioral Analysis**
• Consumer vs. fraudster behavior profiling
• Device fingerprinting for repeat scanners
• Network analysis for coordinated attacks
• Authentication success rate monitoring
• **Status**: 🚧 Rolling out (78% complete)

**Level 3: Predictive Intelligence**
• Machine learning fraud prediction
• Risk scoring for new authentication requests
• Proactive counterfeit operation identification
• Market vulnerability assessment
• **Status**: 🔄 In development (Q2 2025)

**🔐 Enhanced Authentication Features:**

**Dynamic Security Elements:**
• Time-sensitive verification codes
• Location-based authentication rules
• Multi-factor verification for high-value products
• Biometric integration for premium channels

**Blockchain Integration:**
• Immutable product provenance records
• Smart contract verification protocols
• Distributed ledger for supply chain tracking
• Cross-platform authentication sharing

**📡 Monitoring Infrastructure:**

**Global Operations Center:**
• 24/7 threat monitoring team
• Real-time dashboard for all markets
• Automated response protocols
• International enforcement coordination

**Performance Metrics:**
• 99.7% uptime achievement
• <200ms average response time
• 15 languages supported
• 67 countries monitored

**Investment & ROI:**
• Total Enhancement Cost: R12.3M
• Annual Savings: R41.7M  
• ROI: 339% annually
• Payback Period: 3.5 months`,
      followUp: ["What's the AI detection accuracy?", "Show me the global operations center", "How do I access real-time dashboards?", "Compare before/after security metrics"]
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
      "Show me compliance alerts",
      "How can I improve authentication rates?",
      "Break down authentication by product category",
      "Show regional counterfeit hotspots",
      "Analyze premium product vulnerabilities",
      "Break down revenue by product line",
      "Investigate batch scanning patterns"
    ];

    // Initialize with welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      type: 'bot',
      content: `👋 Hello! I'm your AI Data Analyst. I can help you understand your manufacturing and authentication data with deep insights and actionable recommendations.

I have access to your current dashboard statistics and can provide detailed analysis on:
• 📊 Performance metrics and KPI breakdowns
• 🌍 Regional analysis and security hotspots  
• 🔒 Risk assessment and product vulnerabilities
• ⚠️ Compliance monitoring and alert investigation
• 💰 Revenue protection and profitability insights
• 🛡️ Security protocols and enhancement strategies
• 📈 Growth analysis and market trends
• 🔍 Batch-level investigation and forensics

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
• Revenue breakdown by product line
• Month-over-month growth analysis

🌍 **Regional & Geographic Analysis:**
• Regional performance comparisons
• Counterfeit hotspot identification
• Provincial compliance scoring
• Cross-border security measures

🔒 **Risk & Security:**
• Premium product vulnerability assessment
• Batch-level investigation and forensics
• Security protocol enhancements
• Real-time monitoring insights

💰 **Financial Impact:**
• Revenue protection analysis
• Cost-benefit calculations for security measures
• ROI analysis for different protection levels
• Profit margin analysis by product

Try rephrasing your question or ask about any of these specific areas. I can provide detailed, actionable insights with specific data and recommendations!`;
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
            {["Break down authentication by category", "Show regional counterfeit hotspots", "Analyze premium vulnerabilities", "Investigate batch patterns"].map((suggestion, index) => (
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