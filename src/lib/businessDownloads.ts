// Business materials download utilities

export interface BusinessResource {
  title: string;
  type: string;
  description: string;
  filename: string;
  downloadUrl: string;
  mimeType: string;
}

// Utility function to trigger file download
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Generate and download a file from content
export function downloadFileFromContent(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

// Generate Social Media Content Calendar CSV
export function generateSocialMediaCalendar(): string {
  const headers = ['Date', 'Platform', 'Content Type', 'Caption', 'Hashtags', 'Call to Action'];
  
  const sampleData = [
    ['2024-01-01', 'Instagram', 'Photo Post', 'Start your day with gentle morning stretches 🧘‍♀️', '#morningyoga #mindfulness #yogalife #wellness', 'Book your morning class today!'],
    ['2024-01-02', 'Facebook', 'Video', 'Quick 5-minute desk stretches for office workers', '#deskstretches #officeyoga #workplacewellness', 'Try our lunch-time classes'],
    ['2024-01-03', 'Instagram Story', 'Behind the scenes', 'Setting up the studio for today\'s vinyasa flow class', '#behindthescenes #vinyasa #yogastudio', 'Swipe up to book'],
    ['2024-01-04', 'TikTok', 'Tutorial', 'Perfect your downward dog in 3 easy steps', '#yogatutorial #downdog #beginneryoga #yogatips', 'Follow for more tips'],
    ['2024-01-05', 'Instagram', 'Quote Post', '"The body benefits from movement, and the mind benefits from stillness."', '#yogaquotes #mindfulness #inspiration #yogawisdom', 'Find your stillness in class'],
    ['2024-01-06', 'Facebook', 'Event Post', 'Join us for weekend warrior workshop this Saturday', '#workshop #weekendyoga #community', 'Register now - link in bio'],
    ['2024-01-07', 'Instagram', 'Student Spotlight', 'Meet Sarah, who started her yoga journey 6 months ago', '#studentspotlight #yogajourney #community', 'Share your story with us'],
    ['2024-01-08', 'Instagram Story', 'Poll', 'What\'s your favorite time to practice yoga?', '#yogapoll #community #engagement', 'Vote now!'],
    ['2024-01-09', 'TikTok', 'Quick Flow', '30-second energizing morning flow', '#morningflow #quickyoga #energize', 'Full class available on our app'],
    ['2024-01-10', 'Facebook', 'Educational', 'The benefits of pranayama breathing techniques', '#pranayama #breathwork #yogascience', 'Learn more in our classes']
  ];
  
  const csvContent = [headers, ...sampleData]
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
    
  return csvContent;
}

// Generate Email Marketing Template HTML
export function generateEmailTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yoga Class Newsletter</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        .class-schedule { background: #f9f9f9; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ Your Weekly Yoga Newsletter</h1>
            <p>Find your balance, one breath at a time</p>
        </div>
        
        <div class="content">
            <h2>This Week's Highlights</h2>
            <p>Dear [STUDENT_NAME],</p>
            <p>Welcome to another week of mindful movement and inner peace. We're excited to share what's happening in our yoga community this week.</p>
            
            <div class="class-schedule">
                <h3>📅 This Week's Special Classes</h3>
                <ul>
                    <li><strong>Monday 7pm:</strong> Gentle Hatha for Beginners</li>
                    <li><strong>Wednesday 6pm:</strong> Power Vinyasa Flow</li>
                    <li><strong>Friday 8am:</strong> Morning Meditation & Movement</li>
                    <li><strong>Saturday 10am:</strong> Community Class (Donation-based)</li>
                </ul>
            </div>
            
            <h3>💡 Yoga Tip of the Week</h3>
            <p>Remember to breathe deeply during your practice. Your breath is your anchor, helping you stay present and centered in each pose.</p>
            
            <h3>🌟 Student Spotlight</h3>
            <p>This week we're celebrating [STUDENT_NAME] for their dedication to daily practice. Their commitment inspires us all!</p>
            
            <a href="[BOOKING_LINK]" class="button">Book Your Next Class</a>
            
            <h3>📖 Recommended Reading</h3>
            <p>Check out "The Yoga Sutras of Patanjali" for deeper insights into the philosophy behind your practice.</p>
        </div>
        
        <div class="footer">
            <p>© 2024 [STUDIO_NAME]. All rights reserved.</p>
            <p>You're receiving this because you're part of our yoga community.</p>
            <p><a href="[UNSUBSCRIBE_LINK]">Unsubscribe</a> | <a href="[PREFERENCES_LINK]">Update Preferences</a></p>
        </div>
    </div>
</body>
</html>`;
}

// Generate Business Plan Template content
export function generateBusinessPlanTemplate(): string {
  return `# YOGA BUSINESS PLAN TEMPLATE

## EXECUTIVE SUMMARY

### Business Name: [Your Studio Name]
### Location: [Your Location]
### Founded: [Date]
### Business Type: [Sole Proprietorship/LLC/Corporation]

### Mission Statement
[Write a 2-3 sentence mission statement that captures the essence of your yoga business and what you aim to provide to your community]

### Vision Statement  
[Describe where you see your business in 5 years]

### Key Success Factors
- Experienced and certified instructors
- Welcoming and inclusive community atmosphere
- Convenient location and flexible scheduling
- Diverse class offerings for all levels

---

## BUSINESS DESCRIPTION

### Services Offered
- [ ] Group yoga classes (specify styles: Hatha, Vinyasa, Yin, etc.)
- [ ] Private lessons
- [ ] Workshops and retreats
- [ ] Teacher training programs
- [ ] Online classes/streaming
- [ ] Corporate wellness programs
- [ ] Retail (mats, props, apparel)

### Target Market
- **Primary:** [Age group, demographics, lifestyle characteristics]
- **Secondary:** [Additional target segments]

### Unique Value Proposition
[What makes your studio different from competitors?]

---

## MARKET ANALYSIS

### Industry Overview
- The yoga industry continues to grow with [X]% of adults practicing yoga
- Market size: $[X] billion globally
- Local market trends: [Research your local area]

### Competitor Analysis
| Competitor | Strengths | Weaknesses | Pricing |
|------------|-----------|------------|---------|
| Studio A   |           |            |         |
| Studio B   |           |            |         |
| Studio C   |           |            |         |

### SWOT Analysis
**Strengths:**
- 

**Weaknesses:**
- 

**Opportunities:**
- 

**Threats:**
- 

---

## ORGANIZATION & MANAGEMENT

### Organizational Structure
[Describe your business structure and key roles]

### Management Team
- **Owner/Founder:** [Your experience and qualifications]
- **Lead Instructors:** [Key teaching staff]
- **Support Staff:** [Administrative, cleaning, etc.]

### Advisory Board
[Any mentors, business advisors, or experienced practitioners]

---

## SERVICES & PRICING

### Class Schedule Template
| Time | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday |
|------|--------|---------|-----------|----------|--------|----------|--------|
| 6:00 AM |     |         |           |          |        |          |        |
| 7:00 AM |     |         |           |          |        |          |        |
| 8:00 AM |     |         |           |          |        |          |        |
| 12:00 PM |    |         |           |          |        |          |        |
| 6:00 PM |     |         |           |          |        |          |        |
| 7:30 PM |     |         |           |          |        |          |        |

### Pricing Structure
- **Drop-in Rate:** $[X] per class
- **Class Packages:**
  - 5-class package: $[X] (expires in [X] months)
  - 10-class package: $[X] (expires in [X] months)
  - 20-class package: $[X] (expires in [X] months)
- **Monthly Unlimited:** $[X]
- **Annual Membership:** $[X]
- **Student/Senior Discount:** [X]% off
- **Private Lessons:** $[X] per hour

---

## MARKETING & SALES STRATEGY

### Marketing Goals
1. Increase brand awareness in local community
2. Build email list of [X] subscribers in first year
3. Maintain [X]% client retention rate
4. Achieve [X] new students per month

### Marketing Channels
- [ ] Social media (Instagram, Facebook, TikTok)
- [ ] Google Ads and SEO
- [ ] Local partnerships (gyms, spas, wellness centers)
- [ ] Community events and workshops
- [ ] Referral program
- [ ] Email marketing
- [ ] Print advertising (local magazines, flyers)

### Grand Opening Strategy
[Detail your launch plan, including special offers, events, and promotion timeline]

---

## FINANCIAL PROJECTIONS

### Startup Costs
| Item | Cost |
|------|------|
| Studio rent (first 3 months) | $[X] |
| Security deposit | $[X] |
| Renovation/build-out | $[X] |
| Equipment (mats, blocks, bolsters) | $[X] |
| Sound system | $[X] |
| Insurance (annual) | $[X] |
| Business licenses & permits | $[X] |
| Initial marketing & branding | $[X] |
| Working capital | $[X] |
| **TOTAL STARTUP COSTS** | **$[X]** |

### Monthly Operating Expenses
| Expense | Amount |
|---------|--------|
| Rent | $[X] |
| Utilities | $[X] |
| Insurance | $[X] |
| Instructor payments | $[X] |
| Marketing | $[X] |
| Supplies | $[X] |
| Software subscriptions | $[X] |
| Professional services | $[X] |
| **TOTAL MONTHLY EXPENSES** | **$[X]** |

### Revenue Projections (Year 1)
| Month | Students | Avg Revenue/Student | Total Revenue |
|-------|----------|-------------------|---------------|
| 1     | [X]      | $[X]              | $[X]          |
| 2     | [X]      | $[X]              | $[X]          |
| 3     | [X]      | $[X]              | $[X]          |
| ...   | ...      | ...               | ...           |
| 12    | [X]      | $[X]              | $[X]          |

### Break-Even Analysis
- Fixed costs per month: $[X]
- Variable cost per student: $[X]
- Average revenue per student: $[X]
- Break-even point: [X] students per month

---

## FUNDING REQUEST

### Funding Needed: $[X]

### Use of Funds
- Equipment and setup: [X]%
- Working capital: [X]%
- Marketing: [X]%
- Emergency fund: [X]%

### Funding Sources
- [ ] Personal savings: $[X]
- [ ] Small business loan: $[X]
- [ ] Investors: $[X]
- [ ] Crowdfunding: $[X]

---

## RISK ANALYSIS

### Potential Risks
1. **Competition:** New studios opening in area
2. **Economic:** Recession affecting discretionary spending
3. **Seasonal:** Lower attendance in summer months
4. **Staffing:** Difficulty finding qualified instructors

### Risk Mitigation Strategies
[For each risk above, describe how you'll minimize or respond to it]

---

## GROWTH STRATEGY

### Year 1 Goals
- [ ] Establish consistent class schedule
- [ ] Build community of [X] regular students
- [ ] Achieve monthly break-even by month [X]
- [ ] Launch teacher training program

### Year 2-3 Expansion Plans
- [ ] Add second location
- [ ] Develop online platform
- [ ] Launch retreat program
- [ ] Expand retail offerings

---

## APPENDICES

### A. Market Research Data
[Include any surveys, demographic data, or market studies]

### B. Financial Statements
[Attach detailed financial projections, cash flow statements]

### C. Resumes
[Include resumes of key management and instructors]

### D. Letters of Intent
[Any agreements with instructors, landlords, or partners]

### E. Permits and Licenses
[Copies of required business documentation]

---

**Note:** This template provides a framework for your yoga business plan. Customize each section with your specific information, research, and goals. Consider consulting with a business advisor or mentor to refine your plan before seeking funding or launching your studio.`;
}

// Generate Financial Tracking Spreadsheet CSV
export function generateFinancialTrackingSpreadsheet(): string {
  const headers = [
    'Date', 'Description', 'Category', 'Income', 'Expense', 'Payment Method', 
    'Tax Deductible', 'Notes', 'Balance'
  ];
  
  const sampleData = [
    ['2024-01-01', 'Opening Balance', 'Initial Capital', '5000.00', '', 'Bank Transfer', 'No', 'Starting funds', '5000.00'],
    ['2024-01-02', 'Class Package Sale - Sarah M.', 'Class Revenue', '150.00', '', 'Credit Card', 'No', '10-class package', '5150.00'],
    ['2024-01-03', 'Yoga Mat Purchase', 'Equipment', '', '25.99', 'Credit Card', 'Yes', 'New student mats', '5124.01'],
    ['2024-01-04', 'Private Lesson - John D.', 'Private Sessions', '80.00', '', 'Cash', 'No', '1-hour session', '5204.01'],
    ['2024-01-05', 'Studio Rent', 'Rent', '', '1200.00', 'Bank Transfer', 'Yes', 'Monthly rent payment', '4004.01'],
    ['2024-01-06', 'Instructor Payment - Lisa', 'Staff Costs', '', '300.00', 'Cash', 'Yes', 'Week 1 classes', '3704.01'],
    ['2024-01-07', 'Workshop Revenue', 'Workshop Income', '450.00', '', 'Mixed', 'No', 'Yin Yoga Workshop - 15 students', '4154.01'],
    ['2024-01-08', 'Utilities Bill', 'Utilities', '', '85.00', 'Bank Transfer', 'Yes', 'Electricity & water', '4069.01'],
    ['2024-01-09', 'Online Marketing', 'Marketing', '', '120.00', 'Credit Card', 'Yes', 'Facebook & Google ads', '3949.01'],
    ['2024-01-10', 'Retail Sale - Yoga Blocks', 'Retail Revenue', '35.00', '', 'Cash', 'No', 'Two yoga blocks', '3984.01']
  ];
  
  const csvContent = [headers, ...sampleData]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
    
  return csvContent;
}

// Generate Student Intake Form HTML
export function generateStudentIntakeForm(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Intake Form</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 25px; padding: 15px; border: 1px solid #ddd; }
        .section h3 { margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; font-weight: bold; margin-bottom: 5px; }
        input[type="text"], input[type="email"], input[type="tel"], input[type="date"], textarea, select { 
            width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; 
        }
        textarea { height: 80px; resize: vertical; }
        .checkbox-group { display: flex; flex-wrap: wrap; gap: 15px; }
        .checkbox-item { display: flex; align-items: center; min-width: 200px; }
        .checkbox-item input { width: auto; margin-right: 8px; }
        .signature-section { border: 2px solid #333; padding: 20px; margin-top: 30px; }
        .signature-line { border-bottom: 1px solid #333; margin: 20px 0; padding-bottom: 2px; min-height: 40px; }
        @media print { body { padding: 10px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>[STUDIO NAME]</h1>
        <h2>Student Health & Intake Questionnaire</h2>
        <p>Please complete this form before your first class. All information is confidential.</p>
    </div>

    <div class="section">
        <h3>Personal Information</h3>
        <div class="form-group">
            <label>Full Name:</label>
            <input type="text" name="fullName">
        </div>
        <div class="form-group">
            <label>Email Address:</label>
            <input type="email" name="email">
        </div>
        <div class="form-group">
            <label>Phone Number:</label>
            <input type="tel" name="phone">
        </div>
        <div class="form-group">
            <label>Date of Birth:</label>
            <input type="date" name="dob">
        </div>
        <div class="form-group">
            <label>Emergency Contact Name:</label>
            <input type="text" name="emergencyName">
        </div>
        <div class="form-group">
            <label>Emergency Contact Phone:</label>
            <input type="tel" name="emergencyPhone">
        </div>
    </div>

    <div class="section">
        <h3>Yoga Experience</h3>
        <div class="form-group">
            <label>How would you describe your yoga experience?</label>
            <select name="experience">
                <option value="">Please select...</option>
                <option value="complete-beginner">Complete beginner</option>
                <option value="some-experience">Some experience (less than 1 year)</option>
                <option value="regular-practice">Regular practice (1-3 years)</option>
                <option value="experienced">Experienced (3+ years)</option>
                <option value="teacher">Yoga teacher</option>
            </select>
        </div>
        <div class="form-group">
            <label>What styles of yoga have you practiced? (Check all that apply)</label>
            <div class="checkbox-group">
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="hatha"> Hatha</div>
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="vinyasa"> Vinyasa</div>
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="yin"> Yin</div>
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="restorative"> Restorative</div>
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="hot"> Hot Yoga</div>
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="ashtanga"> Ashtanga</div>
                <div class="checkbox-item"><input type="checkbox" name="styles[]" value="other"> Other: _________</div>
            </div>
        </div>
        <div class="form-group">
            <label>What are your goals for practicing yoga?</label>
            <textarea name="goals" placeholder="e.g., improve flexibility, reduce stress, build strength..."></textarea>
        </div>
    </div>

    <div class="section">
        <h3>Health Information</h3>
        <div class="form-group">
            <label>Do you have any current injuries or physical limitations?</label>
            <textarea name="injuries" placeholder="Please describe any areas of concern..."></textarea>
        </div>
        <div class="form-group">
            <label>Are you currently receiving medical treatment or taking medication?</label>
            <textarea name="medical" placeholder="Please list any relevant conditions or medications..."></textarea>
        </div>
        <div class="form-group">
            <label>Have you had any of the following? (Check all that apply)</label>
            <div class="checkbox-group">
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="back-problems"> Back problems</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="neck-problems"> Neck problems</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="joint-problems"> Joint problems</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="heart-condition"> Heart condition</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="high-blood-pressure"> High blood pressure</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="pregnancy"> Currently pregnant</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="recent-surgery"> Recent surgery</div>
                <div class="checkbox-item"><input type="checkbox" name="conditions[]" value="other-condition"> Other condition</div>
            </div>
        </div>
        <div class="form-group">
            <label>Is there anything else about your health or physical condition that your instructor should know?</label>
            <textarea name="additional" placeholder="Any other relevant information..."></textarea>
        </div>
    </div>

    <div class="signature-section">
        <h3>Acknowledgment and Release</h3>
        <p>I understand that yoga involves physical movement and poses that may be challenging. I am voluntarily participating in yoga classes offered by [STUDIO NAME] with full knowledge that yoga may involve risk of injury.</p>
        
        <p>I acknowledge that:</p>
        <ul>
            <li>I am responsible for monitoring my own condition throughout the class</li>
            <li>I will not perform any pose that causes pain or discomfort</li>
            <li>I can modify or skip any pose at any time</li>
            <li>I will inform my instructor of any changes to my health condition</li>
            <li>I participate at my own risk and will not hold [STUDIO NAME] liable for any injury</li>
        </ul>

        <p>By signing below, I acknowledge that I have read and understand this agreement.</p>
        
        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
            <div style="width: 45%;">
                <label>Student Signature:</label>
                <div class="signature-line"></div>
            </div>
            <div style="width: 45%;">
                <label>Date:</label>
                <div class="signature-line"></div>
            </div>
        </div>
        
        <div style="margin-top: 20px;">
            <label>Print Name:</label>
            <div class="signature-line"></div>
        </div>
    </div>

    <div style="margin-top: 30px; padding: 15px; background: #f9f9f9; border: 1px solid #ddd;">
        <h4>For Office Use Only</h4>
        <p>Date Received: _________________ &nbsp;&nbsp;&nbsp; Staff Initials: _________</p>
        <p>Notes: ________________________________________________________________</p>
    </div>
</body>
</html>`;
}