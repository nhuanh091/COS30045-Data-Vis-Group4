// src/pages/Insights.jsx
import { Box, Card, CardContent, Typography } from '@mui/material'

const sections = [
  {
    heading: 'Temporal Trends',
    body: `Roadside drug testing activity shows clear seasonal variation across the 2023–2024 period. Testing volumes tend to peak in the second and third quarters of each year, aligned with increased road enforcement campaigns. Positive detection rates remain relatively stable at approximately 3–5% nationally, though short-term spikes are visible around public holiday periods.`,
  },
  {
    heading: 'Regional Differences',
    body: `New South Wales and Victoria account for the largest share of total tests conducted, reflecting their higher population and more extensive road networks. However, when normalised by testing volume, some smaller jurisdictions show comparable or higher positive rates. Western Australia and Queensland consistently report significant positive detections, particularly for methamphetamine and cannabis. The ACT and Tasmania report the lowest absolute counts due to smaller testing programs.`,
  },
  {
    heading: 'Demographic Patterns',
    body: `The 17–25 and 26–39 age groups account for the highest proportion of positive results and resulting enforcement actions. Cannabis remains the most frequently detected substance across all age groups, followed by methylamphetamine and amphetamine. The 65+ cohort shows markedly lower detection rates across all drug types. Fines are the most common outcome, with formal arrests and charges representing a smaller but significant share of enforcement responses in younger demographics.`,
  },
]

function Insights() {
  return (
    <Box sx={{ px: { xs: 2, md: 3 }, py: 3, maxWidth: 720, mx: 'auto' }}>
      <Typography
        variant="h2"
        sx={{ mb: 0.5, fontSize: { xs: '1.8rem', md: '2.2rem' } }}
      >
        Key Findings
      </Typography>
      <Typography variant="body2" sx={{ color: '#6B7280', mb: 4 }}>
        Patterns derived from the 2023–2024 BITRE roadside drug testing dataset.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {sections.map((section) => (
          <Card key={section.heading}>
            <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
              <Typography variant="h3" sx={{ fontSize: '1.35rem', mb: 1.5 }}>
                {section.heading}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#374151',
                  lineHeight: 1.75,
                  fontSize: '0.95rem',
                  fontFamily: '"Inter", sans-serif',
                }}
              >
                {section.body}
              </Typography>
            </CardContent>
          </Card>
        ))}

        {/* Summary callout */}
        <Box
          sx={{
            background: 'linear-gradient(135deg, #61196E 0%, #2D1B4E 100%)',
            borderRadius: '16px',
            p: 3,
          }}
        >
          <Typography variant="h3" sx={{ fontSize: '1.1rem', color: '#EDDDEC', mb: 1.5 }}>
            Summary
          </Typography>
          <Typography
            sx={{
              color: 'rgba(237,221,236,0.85)',
              lineHeight: 1.75,
              fontSize: '0.9rem',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Roadside drug testing in Australia identifies a consistent 3–5% positive rate across
            jurisdictions, with younger males in metropolitan areas representing the most frequently
            detected demographic. Cannabis and methamphetamine dominate positive detections. Stage 1
            oral fluid testing accounts for the majority of tests conducted. These patterns suggest
            sustained enforcement pressure is warranted, particularly targeting high-risk demographics
            and geographic corridors with elevated detection rates.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default Insights
