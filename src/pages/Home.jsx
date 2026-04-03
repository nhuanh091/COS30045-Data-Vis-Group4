import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material'

function Home() {
  const colors = [
    { name: 'Primary', color: 'primary.main', text: 'Vivid Violet' },
    { name: 'Secondary', color: 'secondary.main', text: 'Soft Purple' },
    { name: 'Success', color: 'success.main', text: 'Income Green' },
    { name: 'Error', color: 'error.main', text: 'Expense Red' },
  ]

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Thiết kế hệ màu (Theme Palette)
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Dưới đây là các màu sắc chính đã được cấu hình cho toàn bộ ứng dụng.
      </Typography>

      <Grid container spacing={3}>
        {colors.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.name}>
            <Card>
              <Box sx={{ height: 100, bgcolor: item.color }} />
              <CardContent>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2" color="text.secondary">{item.text}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button variant="contained" size="large">
          Trình bày Dashboard
        </Button>
      </Box>
    </Box>
  )
}

export default Home
