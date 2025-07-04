# Personal Finance Visualizer

A comprehensive web application for tracking personal finances with advanced budgeting and insights features.

## Features

### Stage 1: Basic Transaction Tracking
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with real-time updates
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling

### Stage 2: Categories & Dashboard
- ✅ Predefined categories for transactions
- ✅ Category-wise pie chart visualization
- ✅ Dashboard with summary cards:
  - Total income and expenses
  - Budget remaining
  - Top spending category
- ✅ Recent transactions overview

### Stage 3: Budgeting & Insights
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison charts
- ✅ Advanced spending insights:
  - Month-over-month spending trends
  - Budget status with progress indicators
  - Top spending categories
  - Over-budget alerts

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or cloud)

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd personal-finance-visualizer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Add your MongoDB connection string:
\`\`\`
MONGODB_URI=your_mongodb_connection_string
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Transactions
1. Navigate to the "Transactions" tab
2. Fill out the transaction form with amount, description, category, type, and date
3. Click "Add Transaction" to save

### Setting Budgets
1. Go to the "Budgets" tab
2. Select a category and set your monthly budget limit
3. View your budget status in real-time

### Viewing Insights
1. Check the "Overview" tab for charts and summaries
2. Visit the "Insights" tab for detailed spending analysis
3. Monitor budget progress and spending trends

## API Endpoints

- \`GET /api/transactions\` - Fetch all transactions
- \`POST /api/transactions\` - Create new transaction
- \`PUT /api/transactions/[id]\` - Update transaction
- \`DELETE /api/transactions/[id]\` - Delete transaction
- \`GET /api/budgets\` - Fetch current month budgets
- \`POST /api/budgets\` - Create/update budget

## Database Schema

### Transactions Collection
\`\`\`javascript
{
  _id: ObjectId,
  amount: Number,
  description: String,
  category: String,
  type: "income" | "expense",
  date: String (YYYY-MM-DD),
  createdAt: String (ISO),
  updatedAt: String (ISO)
}
\`\`\`

### Budgets Collection
\`\`\`javascript
{
  _id: ObjectId,
  category: String,
  amount: Number,
  month: String (YYYY-MM),
  createdAt: String (ISO),
  updatedAt: String (ISO)
}
\`\`\`

## Features Overview

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface

### Error Handling
- Form validation with user-friendly messages
- API error handling with toast notifications
- Loading states for better UX

### Data Visualization
- Interactive charts using Recharts
- Real-time data updates
- Color-coded spending categories

### Budget Management
- Monthly budget setting per category
- Visual progress indicators
- Over-budget warnings and insights

## Deployment

The application is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your \`MONGODB_URI\` environment variable
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
