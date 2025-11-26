export const steps = [
  {
    id: 'carousel_step',
    type: 'carousel',
    headline: 'Tracker Detect Pro',
    headlineText: 'See Who\'s Tracking You',
    subheadlineText: 'Find devices around you',
    images: [
      '/onboarding_carousel_1.webp',
      '/onboarding_carousel_2.webp',
      '/onboarding_carousel_3.webp',
      '/onboarding_carousel_4.webp',
      '/onboarding_carousel_5.webp'
    ],
    buttonText: 'Get Started',
    timeEstimate: 'Takes less than 30 seconds'
  },
  {
    id: 'scan_plan',
    type: 'question',
    question: 'What do you need now?',
    subtitle: 'Tell us how you plan to use the app so we can show the best setup.',
    multiSelect: false,
    options: [
      {
        id: 'quick_scan',
        label: 'One-time scan',
        description: 'I just need a quick sweep right now.',
        icon: '⚡'
      },
      {
        id: 'ongoing',
        label: 'Ongoing protection',
        description: 'Scans over time to protect you across multiple locations.',
        icon: '🛡️'
      },
      {
        id: 'unsure',
        label: 'Still deciding',
        description: 'Show me both so I can choose what fits.',
        icon: '❓'
      }
    ]
  },
  {
    id: 'intent',
    type: 'question',
    question: 'What are you looking for?',
    subtitle: 'We’ll tailor your experience from there.',
    multiSelect: false,
    options: [
      {
        id: 'known_threat',
        label: 'I know I’m being tracked',
        description: 'Guide me straight to the device.',
        icon: '🎯'
      },
      {
        id: 'suspicion',
        label: 'I’m not sure, but I want to check',
        description: 'Run a scan to see if anything is nearby.',
        icon: 'magnifying_glass'
      },
      {
        id: 'privacy',
        label: 'I want better privacy awareness',
        description: 'Show me what’s around me regularly.',
        icon: 'shield'
      },
      {
        id: 'find_mine',
        label: 'I misplaced my own device',
        description: 'Help me find my device.',
        icon: 'mobile'
      }
    ]
  },
  {
    id: 'news_step',
    type: 'news',
    breakingNews: 'BREAKING NEWS',
    surgeTitle: 'Spyware Surge',
    surgeDescription: 'Recent reports show a 400% increase in mobile spyware attacks.',
    fact: 'Over 80% of victims don’t know they are infected.',
    buttonText: 'Scan Now',
    images: [
      '/news_article_1.webp',
      '/news_article_2.webp',
      '/news_article_3.webp'
    ]
  },
  {
    id: 'graph_step',
    type: 'graph',
    headerLabel: 'US Federal Data',
    headerTitle: 'Tracker Stalking Reports 2018-2023',
    yAxisLabel: 'Reports per year',
    xAxisLabel: 'Years',
    badgeText: 'Official Data',
    bottomInfo: '+400% Increase',
    stat1Number: '2.5M',
    stat1Label: 'Victims',
    stat2Number: '85%',
    stat2Label: 'Unaware',
    buttonText: 'See My Risk'
  },


  {
    id: 'results',
    type: 'results',
    title: 'Your personalized app is ready!',
    buttonText: 'Next'
  },
  {
    id: 'features',
    type: 'features',
    title: 'Anti-spy scan',
    description: 'Check your device for spyware and remove it.',
    buttonText: 'Next' // This would lead to payment
  }
];
