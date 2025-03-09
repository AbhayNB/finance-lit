 export const questions = [
  { id: 1, question: "Day trading is a long-term investment strategy.", correctAnswer: false },
  { id: 2, question: "Day trading is a low-risk investment strategy.", correctAnswer: false },
  { id: 3, question: "Anyone can check the background of an investment professional on the Securities and Exchange Commission’s website.", correctAnswer: true },
  { id: 4, question: "Fraudsters may initiate contact with victims on social media platforms or through unsolicited text messages.", correctAnswer: true },
  { id: 5, question: "The past performance of a mutual fund or exchange-traded fund is a nearly perfect indicator of future results.", correctAnswer: false },
  { id: 6, question: "Robo-advisors are free from regulation when acting as fully automated wealth managers.", correctAnswer: false },
  { id: 7, question: "Robo-advisors offer conservative advice as easily accessible guidance in providing investment services.", correctAnswer: true },
  { id: 8, question: "Cryptocurrency is a distributed ledger technology (DLT) application.", correctAnswer: true },
  { id: 9, question: "Cryptocurrency is irreversible once the transactions are made.", correctAnswer: true },
  { id: 10, question: "A blockchain is a centralized system.", correctAnswer: false },
  { id: 11, question: "Financial institutions can use blockchain to optimize their payment, clearing, and settlement processes.", correctAnswer: true },
  { id: 12, question: "Borrowers on a peer-to-peer lending platform indicate the amount of loan they need with their desired maximum interest rates.", correctAnswer: true },
  { id: 13, question: "Peer-to-peer lending is safe from default risk because it tracks post-loan information of borrowers.", correctAnswer: false },
  { id: 14, question: "In a reward-based crowdfunding platform, funders aim to get a positive return in monetary terms.", correctAnswer: false },
  { id: 15, question: "In an equity-based crowdfunding platform, a start-up company will issue securities to get funds to meet financial needs.", correctAnswer: true },
];


export const literacyFeedback = {
  low: {
    title: "Low Literacy",
    suggestions: [
      "Start with basic financial literacy courses online or locally (e.g., Coursera, Khan Academy).",
      "Attend workshops on budgeting and fundamental financial concepts.",
      "Read beginner-friendly books like *Personal Finance for Dummies* by Eric Tyson.",
      "Build an emergency fund and learn key concepts: interest rates, inflation, and regular saving."
    ],
  },
  basic: {
    title: "Basic Literacy",
    suggestions: [
      "Take intermediate courses covering credit management, investing, and retirement planning.",
      "Use online resources (e.g., Investopedia) and apps like Mint or YNAB for finance management.",
      "Open a retirement account (IRA/401k) and explore low-risk investments like CDs or government bonds."
    ],
  },
  moderate: {
    title: "Moderate Literacy",
    suggestions: [
      "Attend advanced courses on stock market analysis and financial planning.",
      "Follow financial experts via webinars and podcasts for market insights.",
      "Practice trading using stock market simulators with no real financial risk.",
      "Diversify your investment portfolio with stocks, bonds, and mutual funds.",
      "Consult a certified financial planner to align strategies with financial goals."
    ],
  },
  high: {
    title: "High Literacy",
    suggestions: [
      "Pursue certifications like CFA or CFP for specialized knowledge.",
      "Join workshops on advanced topics: options trading, real estate, and international markets.",
      "Explore complex investments such as ETFs, REITs, and cryptocurrencies.",
      "Review and optimize your portfolio regularly to adapt to market conditions.",
      "Mentor others at lower literacy levels to reinforce your expertise."
    ],
  },
};
