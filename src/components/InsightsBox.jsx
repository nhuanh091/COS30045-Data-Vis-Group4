import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { LightbulbCircleRounded } from '@mui/icons-material'

/**
 * Reusable component to render a set of insights at the bottom of analysis pages.
 * @param {Array} insights - Array of objects with { title, description }
 */
function InsightsBox({ insights }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Card sx={{ 
        bgcolor: '#FAF7FF', 
        border: '1px solid #EDDDEC', 
        boxShadow: 'none',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <LightbulbCircleRounded sx={{ color: '#E99E1C', fontSize: 28 }} />
            <Typography variant="h3" sx={{ fontSize: '1.2rem', color: '#61196E', fontWeight: 700 }}>
              Key Insights
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {insights.map((item, index) => (
              <ListItem 
                key={index} 
                alignItems="flex-start" 
                sx={{ 
                  px: 0, 
                  py: 2.5,
                  borderBottom: index !== insights.length - 1 ? '1px dashed #EDDDEC' : 'none'
                }}
              >
                <ListItemIcon sx={{ minWidth: 24, mt: 0.8 }}>
                  <Box sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    bgcolor: '#61196E',
                    boxShadow: '0 0 0 3px rgba(97, 25, 110, 0.05)'
                  }} />
                </ListItemIcon>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ 
                    fontSize: '0.95rem', 
                    fontWeight: 700, 
                    color: '#1F2937', 
                    mb: 0.75, 
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: 1.2
                  }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ 
                    fontSize: '0.88rem', 
                    color: '#4B5563', 
                    lineHeight: 1.6, 
                    fontFamily: 'Inter, sans-serif',
                    textAlign: 'justify'
                  }}>
                    {item.description}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InsightsBox
