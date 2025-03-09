import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Svg, Circle, Path } from '@react-pdf/renderer';

// Register font with buffer data
Font.register({
  family: 'Geist',
  fonts: [
    {
      src: '/fonts/GeistVF.woff',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/GeistVF.woff',
      fontWeight: 'bold',
    }
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Geist',
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a365d'
  },
  section: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f7fafc'
  },
  text: {
    fontSize: 12,
    marginBottom: 8,
    color: '#2d3748'
  },
  heading: {
    fontSize: 16,
    marginBottom: 12,
    marginTop: 10,
    color: '#2b6cb0'
  },
  bulletPoint: {
    marginLeft: 10,
    marginBottom: 5
  },
  scoreHighlight: {
    fontSize: 32,
    textAlign: 'center',
    color: '#2b6cb0',
    padding: 20,
    marginTop: 10,
  },
  chartContainer: {
    width: '100%',
    height: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
  },
  questionBox: {
    width: 40,
    height: 40,
    margin: 4,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionText: {
    fontSize: 10,
    color: '#1a202c',
  },
});

// Helper function to calculate pie chart path
const calculatePieChartPath = (score: string, radius: number) => {
  const normalizedScore = parseFloat(score);
  const angle = normalizedScore * 360;
  const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius;
  const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius;
  const largeArcFlag = angle > 180 ? 1 : 0;
  
  return `M ${radius} 0 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x + radius} ${y + radius} L ${radius} ${radius} Z`;
};

const PieChart: React.FC<{ score: string }> = ({ score }) => {
  const radius = 40;
  const path = calculatePieChartPath(score, radius);
  
  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Background circle */}
      <Circle cx={50} cy={50} r={radius} fill="#e2e8f0" />
      {/* Score segment */}
      <Path
        d={`M 50 10 ${path}`}
        fill="#2b6cb0"
        transform="translate(10, 10)"
      />
    </Svg>
  );
};

interface ResultPDFProps {
  score: string;
  country: string;
  literacyLevel: {
    title: string;
    suggestions: string[];
  };
  questionAnswers: boolean[];
}

const ResultPDF: React.FC<ResultPDFProps> = ({ score, country, literacyLevel, questionAnswers }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>Financial Literacy Report</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.chartContainer}>
          <PieChart score={score} />
        </View>
        <Text style={styles.scoreHighlight}>{score} / 1.00</Text>
        <Text style={styles.text}>Country: {country}</Text>
        <Text style={styles.text}>Literacy Level: {literacyLevel.title}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Question Breakdown:</Text>
        <View style={styles.breakdownGrid}>
          {questionAnswers.map((correct, idx) => (
            <View
              key={idx}
              style={[
                styles.questionBox,
                { backgroundColor: correct ? '#C6F6D5' : '#FED7D7' }
              ]}
            >
              <Text style={styles.questionText}>Q{idx + 1}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Recommendations:</Text>
        {literacyLevel.suggestions.map((suggestion, index) => (
          <Text key={index} style={styles.bulletPoint}>• {suggestion}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default ResultPDF;