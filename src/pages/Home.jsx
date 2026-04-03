import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material'

function Home() {
  const palette1 = [
    { name: 'Eminence', color: '#61196E', text: 'Primary Deep Purple' },
    { name: 'Gamboge', color: '#E99E1C', text: 'Accent Golden Yellow' },
    { name: 'Sky Magenta', color: '#BF6BA1', text: 'Soft Accent' },
    { name: 'Sienna', color: '#852501', text: 'Deep Earthy Brown' },
    { name: 'Apricot', color: '#FDCBB4', text: 'Soft Peach' },
  ]

  const palette2 = [
    { name: 'Platinum', color: '#EDDDEC', text: 'Lightest Tint' },
    { name: 'African Violet', color: '#A48ECA', text: 'Secondary Purple' },
    { name: 'Royal Purple', color: '#7658B2', text: 'Vivid Purple' },
    { name: 'Liberty', color: '#60509D', text: 'Deep Blue Purple' },
    { name: 'Dark Lavender', color: '#6D588B', text: 'Muted Deep Purple' },
  ]

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h3" fontWeight="800" gutterBottom>
        Synced Professional Palette
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 6, maxWidth: 600 }}>
        Hệ màu đã được đồng bộ chính xác theo các bảng mã màu từ ảnh tham khảo của bạn. 
        Sự kết hợp giữa <b>Eminence</b> và <b>Gamboge</b> tạo nên vẻ sang trọng và hiện đại.
      </Typography>

      <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>Palette 1: Sunset & Lavender</Typography>
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {palette1.map((item) => (
          <Grid item xs={12} sm={6} md={2.4} key={item.name}>
            <Card sx={{ border: 'none', background: '#FFFFFF' }}>
              <Box sx={{ height: 120, bgcolor: item.color }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight="700">{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">{item.color}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight="700" sx={{ mb: 3 }}>Palette 2: Abstract Purples</Typography>
      <Grid container spacing={3}>
        {palette2.map((item) => (
          <Grid item xs={12} sm={6} md={2.4} key={item.name}>
            <Card sx={{ border: 'none', background: '#FFFFFF' }}>
              <Box sx={{ height: 120, bgcolor: item.color }} />
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" fontWeight="700">{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">{item.color}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 8, display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Button variant="contained" color="primary" size="large">
          Eminence Button
        </Button>
        <Button variant="contained" color="warning" size="large">
          Gamboge Button
        </Button>
      </Box>
    </Box>
  )
}

export default Home
