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
  const headers = [
    'Date', 'Platform', 'Content Type', 'Caption', 'Hashtags', 'Call to Action', 
    'Best Time', 'Visual Suggestion', 'Engagement Strategy'
  ];
  
  const sampleData = [
    // Week 1 - New Year, New Practice
    ['2024-01-01', 'Instagram', 'Photo Post', 'Start your year with intention 🧘‍♀️ New Year, new practice, new you! What intentions are you setting for your yoga journey this year?', '#newyearintention #yogaintention #2024goals #mindfulstart #yogajourney #namaste', 'Share your intentions in the comments!', '7:00 AM', 'Sunrise meditation pose', 'Ask followers to share their intentions'],
    ['2024-01-02', 'Facebook', 'Video Tutorial', 'New to yoga? Start here! 🌟 This 10-minute gentle flow is perfect for beginners. Remember: every expert was once a beginner.', '#beginneryoga #gentleflow #yogaforbeginners #newstudents #yogatutorial #mindfulness', 'Try our beginner-friendly classes', '12:00 PM', '10-minute flow demonstration', 'Pin comment with class schedule'],
    ['2024-01-03', 'Instagram Story', 'Behind the Scenes', 'Morning prep ritual ☀️ Watch how we prepare the studio with love and intention for each class', '#behindthescenes #morningprep #studioreflection #yogastudio #intention', 'Swipe up for today\'s schedule', '6:30 AM', 'Studio setup time-lapse', 'Show the care that goes into each class'],
    ['2024-01-04', 'TikTok', 'Quick Tutorial', 'Desk yoga hack! 💻 Perfect your seated spinal twist in 30 seconds. Your back will thank you!', '#deskYoga #officewellness #spinaltwist #workplaceyoga #quickstretch #productivity', 'Follow for daily office yoga tips', '11:00 AM', 'Office setting demonstration', 'Create series of office yoga content'],
    ['2024-01-05', 'Instagram', 'Quote Post', '"Yoga is not about touching your toes. It is about what you learn on the way down." - Judith Hanson Lasater', '#yogaquotes #yogawisdom #journey #process #mindfulness #selfdiscovery #inspiration', 'What have you learned on your yoga journey?', '6:00 PM', 'Beautiful quote overlay on nature', 'Encourage personal sharing in comments'],
    ['2024-01-06', 'Facebook', 'Community Post', 'Saturday Spotlight: Community Class 🌟 Every Saturday we host a donation-based class open to all levels. It\'s amazing to see our yoga family grow!', '#communityclass #yogafamily #donationbased #saturdayclass #inclusiveyoga #community', 'Join us this Saturday at 10 AM', '8:00 AM', 'Group class photo from previous week', 'Build community feel and belonging'],
    ['2024-01-07', 'Instagram', 'Student Feature', 'Student Spotlight: Meet Maria! 📸 "Yoga helped me find strength I didn\'t know I had, both physically and mentally." - Maria, practicing for 8 months', '#studentspotlight #yogastory #transformation #strength #community #inspiration', 'Want to share your story? DM us!', '4:00 PM', 'Before/after or journey photos', 'Build authentic community stories'],
    
    // Week 2 - Building Foundations
    ['2024-01-08', 'Instagram Story', 'Poll', 'Help us plan! 🗳️ What workshop would you most like to see this month?', '#yogapoll #workshopideas #communityinput #yogaworkshop #planning', 'Vote and suggest ideas!', '2:00 PM', 'Poll with workshop options', 'Gather community input for programming'],
    ['2024-01-09', 'TikTok', 'Morning Flow', 'Monday motivation: 60-second energizing flow ⚡ Start your week with intention and energy!', '#mondaymotivation #morningflow #energizing #weekstart #quickyoga #motivation', 'Full 20-min class on our app', '6:00 AM', 'Quick energizing sequence', 'Drive app downloads and engagement'],
    ['2024-01-10', 'Facebook', 'Educational', 'Breathing 101: Ujjayi Pranayama 🌬️ Also called "ocean breath," this technique calms the nervous system and builds internal heat during practice.', '#pranayama #breathwork #ujjayibreath #yogascience #stressrelief #mindfulness', 'Learn breathing techniques in our classes', '10:00 AM', 'Close-up of proper breathing technique', 'Educational series building expertise'],
    ['2024-01-11', 'Instagram', 'Pose Tutorial', 'Pose Breakdown: Warrior II 🏹 Foundation is everything! Check your alignment: front thigh parallel to ground, back leg straight and strong.', '#warriorpose #posealignment #yogabasics #foundationpose #strength #tutorial', 'Perfect your poses in our alignment classes', '5:00 PM', 'Step-by-step alignment photos', 'Build trust through expertise'],
    ['2024-01-12', 'Instagram Story', 'Quick Tip', 'Yoga Tip Thursday: Listen to your body 👂 Pain is your body saying "stop," discomfort is saying "pay attention."', '#yogatipthursday #bodywisdom #mindfulpractice #selfcare #awareness', 'Practice mindfully with us', '9:00 AM', 'Gentle reminder graphics', 'Build safety-conscious community'],
    ['2024-01-13', 'Facebook', 'Event Announcement', 'Special Workshop Alert! 🎉 "Yoga for Better Sleep" - January 20th, 7 PM. Learn sequences and breathing techniques for deeper rest.', '#workshopalert #bettersleep #sleepyoga #restorative #relaxation #workshop', 'Register now - limited spots!', '11:00 AM', 'Peaceful evening yoga imagery', 'Create urgency and clear value proposition'],
    ['2024-01-14', 'Instagram', 'Weekend Vibes', 'Sunday Self-Care Reminder 🛁 Your practice doesn\'t always have to be on the mat. Take a bath, read a book, or simply breathe deeply.', '#sundayselfcare #selfcaresunday #restday #mindfulness #balance #wellbeing', 'How are you practicing self-care today?', '10:00 AM', 'Relaxing self-care imagery', 'Expand definition of yoga practice'],
    
    // Week 3 - Deepening Practice
    ['2024-01-15', 'TikTok', 'Flexibility Myth', 'Myth Buster Monday! 🚫 "I\'m not flexible enough for yoga" - Yoga isn\'t about being flexible, it\'s about becoming flexible!', '#mythbuster #flexibilitymyth #beginneryoga #yogamyths #accessibility #inclusion', 'Everyone is welcome in our classes!', '7:00 AM', 'Before/after flexibility examples', 'Address common barriers to practice'],
    ['2024-01-16', 'Instagram', 'Transformation Tuesday', 'Transformation isn\'t just physical 💫 Our student Jake shares: "Yoga taught me patience with myself and others. That\'s the real transformation."', '#transformationtuesday #mentalhealth #patience #personalgrowth #yogabenefits #mindset', 'What has yoga transformed in your life?', '3:00 PM', 'Thoughtful portrait of student', 'Highlight mental/emotional benefits'],
    ['2024-01-17', 'Facebook', 'Nutrition Tip', 'Fuel Your Practice 🥗 What you eat affects your energy on the mat. Try light, easily digestible foods 2-3 hours before class.', '#yoganutrition #preclasseating #energyforyoga #wellness #holistichealth #fueling', 'Ask our instructors for more nutrition tips', '1:00 PM', 'Healthy pre-yoga meal suggestions', 'Expand into lifestyle wellness'],
    ['2024-01-18', 'Instagram Story', 'Behind the Scenes', 'Instructor Prep Time 👩‍🏫 Ever wonder how we plan our sequences? Here\'s a peek into class preparation and intention setting.', '#instructorlife #classplanning #behindthescenes #intention #preparation #teaching', 'Appreciate your teachers today!', '4:00 PM', 'Teacher planning and prep work', 'Humanize instructors and build appreciation'],
    ['2024-01-19', 'Instagram', 'Throwback', 'Throwback to our first community class! 📸 Look how our yoga family has grown. Thank you for being part of this beautiful journey.', '#throwbackthursday #communitygrowth #yogafamily #grateful #journey #community', 'Tag someone who brought you to yoga!', '6:00 PM', 'Early community class photos', 'Celebrate growth and community building'],
    ['2024-01-20', 'TikTok', 'Stress Relief', 'Instant stress relief! 😌 Try this 3-breath technique: Inhale for 4, hold for 4, exhale for 6. Science-backed stress relief in 30 seconds!', '#stressrelief #breathwork #anxietyhelp #mentalhealth #quickrelief #breathing', 'Learn more breathing techniques with us', '12:00 PM', 'Calming breathing demonstration', 'Provide immediate value and stress relief'],
    ['2024-01-21', 'Facebook', 'Weekend Workshop Recap', 'Amazing workshop yesterday! 🌙 "Yoga for Better Sleep" was transformative. Participants learned moon salutations, restorative poses, and sleep-inducing breathing.', '#workshoprecap #bettersleep #moonsalutations #restorative #restfulnight #success', 'Missed it? We\'ll offer it again soon!', '9:00 AM', 'Workshop highlights and participant feedback', 'Show value and create FOMO for future events'],
    
    // Week 4 - Community and Connection  
    ['2024-01-22', 'Instagram', 'Mindful Monday', 'Monday Mindfulness: Practice Gratitude 🙏 Before you get out of bed, think of three things you\'re grateful for. Watch how it shifts your entire day.', '#mindfulmonday #gratitude #morningritual #positivity #mindfulness #intention', 'Share one thing you\'re grateful for today!', '6:30 AM', 'Peaceful morning gratitude imagery', 'Start week with positive community engagement'],
    ['2024-01-23', 'Instagram Story', 'Question Time', 'Q&A Tuesday! 🤔 "How often should I practice yoga?" Great question! Quality over quantity - even 10 minutes daily beats 2 hours once a week.', '#questiontuesday #yogafrequency #practiceadvice #consistency #qualityoverquantity #advice', 'Send us your yoga questions!', '11:00 AM', 'FAQ-style graphics', 'Build expertise and trust through education'],
    ['2024-01-24', 'TikTok', 'Hip Opener', 'Hip Opener Wednesday! 🦋 Sitting all day? This pigeon prep will be your new best friend. Hold for 30 seconds each side.', '#hipopener #pigeonprep #deskjob #hiprelief #stretching #mobility', 'More hip openers in our Yin classes', '3:00 PM', 'Clear hip opening demonstration', 'Address common physical issues from modern lifestyle'],
    ['2024-01-25', 'Facebook', 'Teacher Spotlight', 'Teacher Thursday: Meet Lisa! 👩‍🏫 500-hour certified, specializes in trauma-informed yoga. "My goal is creating safe spaces for healing and growth."', '#teacherspotlight #traumainformed #safespace #healing #yogateacher #community', 'Book a class with Lisa this week!', '2:00 PM', 'Professional teacher headshot and bio', 'Build trust and personal connections'],
    ['2024-01-26', 'Instagram', 'Friday Motivation', 'Friday Flow Motivation! 💪 "The success of yoga does not lie in the ability to attain the perfect posture but in how it brings balance to your life."', '#fridaymotivation #balance #yogaphilosophy #lifebalance #wisdom #perspective', 'Find your balance in our weekend classes', '5:00 PM', 'Balanced pose with inspirational overlay', 'End week on motivational note'],
    ['2024-01-27', 'Instagram Story', 'Saturday Schedule', 'Saturday Lineup! 📅 9 AM Gentle Flow, 10:30 AM Community Class, 12 PM Power Vinyasa. Which one calls to you?', '#saturdayschedule #classlineup #weekendyoga #variety #allevels #choice', 'Book your spot now!', '7:00 AM', 'Clean schedule graphic', 'Drive weekend bookings'],
    ['2024-01-28', 'Facebook', 'Sunday Reflection', 'Sunday Reflection 🌅 This week we explored intention, breathwork, and community. What was your biggest insight or breakthrough?', '#sundayreflection #weeklyreflection #insights #growth #community #sharing', 'Share your weekly wins with us!', '11:00 AM', 'Reflective sunset/sunrise imagery', 'Build deeper community connection through sharing'],
    
    // Week 5 - Special Focus Content
    ['2024-01-29', 'TikTok', 'Core Strength', 'Core Monday! 💥 Forget crunches - try boat pose! Hold for 30 seconds, repeat 3 times. Your core will thank you!', '#coremonday #boatpose #corestrength #abworkout #yogacore #strength', 'Strengthen your core in our classes', '6:00 AM', 'Progressive boat pose demonstration', 'Appeal to fitness-focused audience'],
    ['2024-01-30', 'Instagram', 'Props Education', 'Props are your friends! 🧱 Blocks aren\'t for "beginners" - they\'re tools for better alignment and deeper poses. Embrace the props!', '#yogaprops #blocks #alignment #tools #propsarenotforbeginners #support', 'We provide all props in our classes', '4:00 PM', 'Creative prop usage examples', 'Normalize prop usage and improve accessibility'],
    ['2024-01-31', 'Facebook', 'Monthly Recap', 'January Recap: What a month! 🎉 New students joined, community classes grew, workshops sold out, and our yoga family expanded. Thank you for being part of our journey!', '#monthlyrecap #january2024 #community #growth #grateful #yogafamily', 'Excited for February adventures!', '8:00 PM', 'Month highlight collage', 'Celebrate community achievements and build momentum']
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
    <title>Yoga Studio Email Templates</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 20px; 
            background: #f5f7fa;
        }
        .template-section {
            margin-bottom: 40px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .template-header {
            background: #667eea;
            color: white;
            padding: 15px 20px;
            font-weight: bold;
            font-size: 18px;
        }
        .template-content {
            padding: 20px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #fff; 
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 20px; 
            text-align: center; 
        }
        .content { 
            padding: 20px; 
        }
        .footer { 
            background: #f4f4f4; 
            padding: 15px; 
            text-align: center; 
            font-size: 12px; 
            color: #666;
        }
        .button { 
            display: inline-block; 
            background: #667eea; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 10px 0; 
            font-weight: bold;
        }
        .class-schedule { 
            background: #f9f9f9; 
            padding: 15px; 
            margin: 15px 0; 
            border-left: 4px solid #667eea; 
        }
        .welcome-series { 
            background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%); 
        }
        .promotion { 
            background: linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%); 
        }
        .retention { 
            background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); 
        }
        .seasonal { 
            background: linear-gradient(135deg, #00b894 0%, #00cec9 100%); 
        }
        .highlight-box {
            background: #e8f4fd;
            border: 1px solid #bee5eb;
            border-radius: 5px;
            padding: 15px;
            margin: 15px 0;
        }
        .pricing-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        .pricing-table th, .pricing-table td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: center;
        }
        .pricing-table th {
            background: #667eea;
            color: white;
        }
        .testimonial {
            font-style: italic;
            background: #f8f9fa;
            padding: 15px;
            border-left: 3px solid #667eea;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <h1 style="text-align: center; color: #667eea; margin-bottom: 30px;">Yoga Studio Email Template Collection</h1>
    
    <!-- Template 1: Weekly Newsletter -->
    <div class="template-section">
        <div class="template-header">📧 Template 1: Weekly Newsletter</div>
        <div class="template-content">
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
                    
                    <div class="testimonial">
                        <p>"This studio has become my sanctuary. The teachers are incredible and the community is so welcoming!" - Sarah M.</p>
                    </div>
                    
                    <a href="[BOOKING_LINK]" class="button">Book Your Next Class</a>
                    
                    <h3>📖 Recommended Reading</h3>
                    <p>Check out "The Yoga Sutras of Patanjali" for deeper insights into the philosophy behind your practice.</p>
                </div>
                
                <div class="footer">
                    <p>© 2024 [STUDIO_NAME]. All rights reserved.</p>
                    <p><a href="[UNSUBSCRIBE_LINK]">Unsubscribe</a> | <a href="[PREFERENCES_LINK]">Update Preferences</a></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Template 2: Welcome Series Email -->
    <div class="template-section">
        <div class="template-header">🌟 Template 2: Welcome Series (New Student)</div>
        <div class="template-content">
            <div class="container">
                <div class="header welcome-series">
                    <h1>🙏 Welcome to Our Yoga Family!</h1>
                    <p>Your journey to wellness starts here</p>
                </div>
                
                <div class="content">
                    <h2>Welcome, [STUDENT_NAME]!</h2>
                    <p>We're thrilled you've chosen to begin your yoga journey with us. Whether you're a complete beginner or returning to practice, we're here to support you every step of the way.</p>
                    
                    <div class="highlight-box">
                        <h3>🎁 Your Welcome Gift</h3>
                        <p>As a new member, you receive:</p>
                        <ul>
                            <li>Free yoga mat for your first month</li>
                            <li>Complimentary 30-minute consultation with our head instructor</li>
                            <li>Access to our beginner's guide video library</li>
                        </ul>
                    </div>
                    
                    <h3>🏃‍♀️ Getting Started</h3>
                    <p><strong>Best Classes for Beginners:</strong></p>
                    <ul>
                        <li><strong>Gentle Hatha:</strong> Mondays 7 PM - Perfect for learning basic poses</li>
                        <li><strong>Beginner Flow:</strong> Thursdays 6 PM - Introduction to movement sequences</li>
                        <li><strong>Restorative Yoga:</strong> Sundays 5 PM - Deep relaxation and stress relief</li>
                    </ul>
                    
                    <div class="highlight-box">
                        <h3>📱 Download Our App</h3>
                        <p>Book classes, track your progress, and access exclusive content with our mobile app.</p>
                        <a href="[APP_LINK]" class="button">Download Now</a>
                    </div>
                    
                    <h3>🤔 What to Expect</h3>
                    <p>Arrive 10 minutes early for your first class. We'll help you get settled, provide props, and introduce you to your instructor. Remember: everyone was a beginner once!</p>
                    
                    <a href="[BOOKING_LINK]" class="button">Book Your First Class</a>
                </div>
                
                <div class="footer">
                    <p>Questions? Reply to this email or call us at [PHONE]</p>
                    <p>© 2024 [STUDIO_NAME]. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Template 3: Workshop/Event Promotion -->
    <div class="template-section">
        <div class="template-header">🎉 Template 3: Workshop/Event Promotion</div>
        <div class="template-content">
            <div class="container">
                <div class="header promotion">
                    <h1>🌙 Special Workshop Alert!</h1>
                    <p>Transform Your Evening Routine</p>
                </div>
                
                <div class="content">
                    <h2>Yoga for Better Sleep Workshop</h2>
                    <p>Dear [STUDENT_NAME],</p>
                    <p>Struggling with restless nights? Join us for a transformative workshop designed to help you unwind, relax, and prepare for deep, restorative sleep.</p>
                    
                    <div class="highlight-box">
                        <h3>📅 Workshop Details</h3>
                        <ul>
                            <li><strong>Date:</strong> Saturday, [DATE]</li>
                            <li><strong>Time:</strong> 7:00 PM - 9:00 PM</li>
                            <li><strong>Investment:</strong> $45 (Members: $35)</li>
                            <li><strong>Includes:</strong> Workshop, take-home guide, herbal tea</li>
                        </ul>
                    </div>
                    
                    <h3>✨ What You'll Learn</h3>
                    <ul>
                        <li>Gentle yoga sequences to release physical tension</li>
                        <li>Breathing techniques for nervous system regulation</li>
                        <li>Meditation practices for quieting mental chatter</li>
                        <li>Creating an optimal sleep environment</li>
                        <li>Ayurvedic tips for better rest</li>
                    </ul>
                    
                    <div class="testimonial">
                        <p>"After the sleep workshop, I've been sleeping through the night for the first time in years. Life-changing!" - Jennifer K.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <p><strong>Early Bird Special: Register by [DATE] and save $10!</strong></p>
                        <a href="[REGISTRATION_LINK]" class="button" style="font-size: 18px; padding: 15px 30px;">Register Now - Limited Spots!</a>
                    </div>
                    
                    <p><em>Space is limited to 20 participants to ensure personalized attention. Suitable for all levels.</em></p>
                </div>
                
                <div class="footer">
                    <p>Questions? Contact us at [EMAIL] or [PHONE]</p>
                    <p>© 2024 [STUDIO_NAME]. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Template 4: Win-Back/Retention Email -->
    <div class="template-section">
        <div class="template-header">💜 Template 4: Win-Back/Retention Email</div>
        <div class="template-content">
            <div class="container">
                <div class="header retention">
                    <h1>We Miss You! 🕊️</h1>
                    <p>Your mat is waiting for you</p>
                </div>
                
                <div class="content">
                    <h2>Hey [STUDENT_NAME],</h2>
                    <p>We noticed it's been a while since your last visit, and we wanted to reach out because you're an important part of our yoga community.</p>
                    
                    <p>Life gets busy – we totally understand. Sometimes our practice takes a backseat to other priorities, and that's completely normal.</p>
                    
                    <div class="highlight-box">
                        <h3>🎁 Welcome Back Offer</h3>
                        <p>We'd love to help you reconnect with your practice:</p>
                        <ul>
                            <li><strong>3 Classes for $39</strong> (Regular price: $75)</li>
                            <li>Valid for 6 weeks from purchase</li>
                            <li>Use for any class on our schedule</li>
                            <li>No commitment required</li>
                        </ul>
                    </div>
                    
                    <h3>🌱 What's New Since You've Been Away</h3>
                    <ul>
                        <li>New gentle morning classes perfect for easing back in</li>
                        <li>Updated studio with improved ventilation and lighting</li>
                        <li>Extended class schedule with more beginner-friendly options</li>
                        <li>New online class library for home practice</li>
                    </ul>
                    
                    <div class="testimonial">
                        <p>"Coming back to yoga after a break was intimidating, but the teachers made me feel so welcome. It's like I never left!" - Michael R.</p>
                    </div>
                    
                    <p><strong>Remember:</strong> There's no judgment here, only support. Your yoga journey is unique, and we're honored to be part of it whenever you're ready.</p>
                    
                    <a href="[COMEBACK_OFFER_LINK]" class="button">Claim Your Welcome Back Offer</a>
                    
                    <p style="margin-top: 20px;"><em>Offer expires [DATE]. Can't make it to the studio? Ask about our online class options!</em></p>
                </div>
                
                <div class="footer">
                    <p>Not ready to return? That's okay too. <a href="[UNSUBSCRIBE_LINK]">Update your preferences</a> to hear from us less often.</p>
                    <p>© 2024 [STUDIO_NAME]. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Template 5: Seasonal/Holiday Promotion -->
    <div class="template-section">
        <div class="template-header">🌸 Template 5: Seasonal/Holiday Promotion</div>
        <div class="template-content">
            <div class="container">
                <div class="header seasonal">
                    <h1>🌸 Spring into Wellness</h1>
                    <p>Renew your practice with the season</p>
                </div>
                
                <div class="content">
                    <h2>Spring Renewal Package</h2>
                    <p>Hello [STUDENT_NAME],</p>
                    <p>As nature awakens from winter's rest, it's the perfect time to refresh your yoga practice and plant seeds for growth in the year ahead.</p>
                    
                    <div class="highlight-box">
                        <h3>🌱 Spring Special - Limited Time</h3>
                        <table class="pricing-table">
                            <tr>
                                <th>Package</th>
                                <th>Regular Price</th>
                                <th>Spring Price</th>
                                <th>You Save</th>
                            </tr>
                            <tr>
                                <td>10-Class Package</td>
                                <td>$180</td>
                                <td>$150</td>
                                <td>$30</td>
                            </tr>
                            <tr>
                                <td>Unlimited Month</td>
                                <td>$120</td>
                                <td>$99</td>
                                <td>$21</td>
                            </tr>
                            <tr>
                                <td>3-Month Unlimited</td>
                                <td>$330</td>
                                <td>$279</td>
                                <td>$51</td>
                            </tr>
                        </table>
                        <p><em>Packages expire 6 months from purchase. Offer valid through [DATE].</em></p>
                    </div>
                    
                    <h3>🌿 Spring Schedule Highlights</h3>
                    <ul>
                        <li><strong>Detox Flow:</strong> Twist out winter's stagnation</li>
                        <li><strong>Heart Opening Series:</strong> Welcome new possibilities</li>
                        <li><strong>Outdoor Classes:</strong> Practice in the fresh spring air (weather permitting)</li>
                        <li><strong>Meditation in the Garden:</strong> Sunday mornings at 8 AM</li>
                    </ul>
                    
                    <div class="highlight-box">
                        <h3>🎁 Bonus: Refer a Friend</h3>
                        <p>Bring a friend to their first class and you both get a free smoothie from our partner juice bar!</p>
                    </div>
                    
                    <div style="text-align: center; margin: 25px 0;">
                        <a href="[SPRING_SPECIAL_LINK]" class="button" style="font-size: 18px; padding: 15px 30px;">Claim Spring Pricing</a>
                    </div>
                    
                    <p>Spring is nature's way of saying "let's party!" Join us in celebrating renewal, growth, and the joy of movement.</p>
                </div>
                
                <div class="footer">
                    <p>Follow us: <a href="[INSTAGRAM]">Instagram</a> | <a href="[FACEBOOK]">Facebook</a> | <a href="[WEBSITE]">Website</a></p>
                    <p>© 2024 [STUDIO_NAME]. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Customization Instructions -->
    <div class="template-section">
        <div class="template-header">📝 Customization Instructions</div>
        <div class="template-content">
            <h3>How to Use These Templates:</h3>
            <ol>
                <li><strong>Replace Placeholders:</strong> 
                    <ul>
                        <li>[STUDIO_NAME] - Your studio's name</li>
                        <li>[STUDENT_NAME] - Recipient's first name</li>
                        <li>[EMAIL] - Your contact email</li>
                        <li>[PHONE] - Your phone number</li>
                        <li>[BOOKING_LINK] - Link to your booking system</li>
                        <li>[UNSUBSCRIBE_LINK] - Unsubscribe URL</li>
                        <li>[DATE] - Specific dates for events/offers</li>
                    </ul>
                </li>
                <li><strong>Customize Colors:</strong> Modify the gradient backgrounds to match your brand colors</li>
                <li><strong>Add Your Logo:</strong> Include your studio logo in the header sections</li>
                <li><strong>Adapt Content:</strong> Modify class names, schedules, and pricing to match your offerings</li>
                <li><strong>Test Thoroughly:</strong> Send test emails to yourself and check display on mobile devices</li>
            </ol>
            
            <h3>Email Marketing Best Practices:</h3>
            <ul>
                <li>Segment your list (new students, returning students, lapsed members)</li>
                <li>Use compelling subject lines (avoid spam triggers)</li>
                <li>Include clear call-to-action buttons</li>
                <li>Keep emails mobile-friendly</li>
                <li>Send at optimal times (Tuesday-Thursday, 9-11 AM or 1-3 PM)</li>
                <li>Track open rates, click-through rates, and conversions</li>
                <li>Always include unsubscribe options</li>
            </ul>
        </div>
    </div>

</body>
</html>`;
}

// Generate Business Plan Template content
export function generateBusinessPlanTemplate(): string {
  return `# COMPREHENSIVE YOGA BUSINESS PLAN TEMPLATE

*A Complete Guide to Launching and Growing Your Yoga Studio*

---

## EXECUTIVE SUMMARY

### Business Overview
**Business Name:** [Your Studio Name] (e.g., "Mindful Movement Yoga Studio")
**Legal Structure:** [Sole Proprietorship/LLC/Corporation]
**Location:** [Complete Address, City, State, ZIP]
**Founded:** [Date]
**Owner(s):** [Your Name and Qualifications]

### Mission Statement
*Example: "To create a welcoming sanctuary where individuals of all backgrounds and abilities can discover the transformative power of yoga, build community connections, and cultivate lasting wellness practices that extend far beyond the mat."*

[Write your 2-3 sentence mission statement here]

### Vision Statement  
*Example: "To become the premier wellness destination in [Your City], known for exceptional instruction, inclusive community, and innovative programming that serves students from complete beginners to advanced practitioners."*

[Describe where you see your business in 5-10 years]

### Key Success Factors
- **Experienced Leadership:** [X] years of teaching experience, [certification level]
- **Strategic Location:** High-traffic area with ample parking and accessibility
- **Diverse Programming:** Multiple yoga styles, workshops, teacher training
- **Community Focus:** Inclusive environment welcoming all bodies and budgets
- **Technology Integration:** Modern booking system, virtual class options
- **Financial Sustainability:** Multiple revenue streams and conservative growth projections

### Financial Highlights (Year 1 Projections)
- **Total Investment Required:** $[X] (See detailed breakdown in Financial section)
- **Projected Revenue Year 1:** $[X]
- **Break-even Month:** Month [X]
- **Projected Net Profit Year 1:** $[X] ([X]% margin)

---

## BUSINESS DESCRIPTION

### Industry Overview
The yoga industry has experienced tremendous growth, with over 36 million Americans practicing yoga as of 2023—up from 20.4 million in 2012. The industry generates approximately $16 billion annually in the United States alone.

**Industry Trends:**
- Increased focus on mental health and stress reduction
- Growing acceptance of yoga as legitimate healthcare complement
- Rising popularity of specialized classes (trauma-informed, prenatal, senior yoga)
- Integration of technology (virtual classes, apps, wearables)
- Emphasis on diversity, equity, and inclusion in yoga spaces

### Services Offered

#### Core Class Offerings
**Beginner-Friendly Classes:**
- [ ] Gentle Hatha (60 minutes) - Focus on basic poses and alignment
- [ ] Beginner Vinyasa (45 minutes) - Introduction to flowing sequences  
- [ ] Restorative Yoga (75 minutes) - Deep relaxation and stress relief
- [ ] Chair Yoga (45 minutes) - Accessible practice for limited mobility

**Intermediate/Advanced Classes:**
- [ ] Power Vinyasa (60 minutes) - Athletic, flowing practice
- [ ] Ashtanga (90 minutes) - Traditional set sequence
- [ ] Hot Yoga (60 minutes) - Practice in heated room (95-105°F)
- [ ] Yin Yoga (75 minutes) - Long-held passive poses

**Specialty Classes:**
- [ ] Prenatal Yoga - Safe practice for expecting mothers
- [ ] Parent & Baby Yoga - Bonding classes for new parents
- [ ] Senior Yoga (55+) - Age-appropriate gentle practice
- [ ] Teen Yoga - Mindfulness and movement for adolescents
- [ ] Trauma-Informed Yoga - Healing-focused practice

#### Additional Services
- [ ] Private lessons ($75-150/hour)
- [ ] Small group sessions (2-4 people, $40-60/person)
- [ ] Corporate wellness programs ($200-500/session)
- [ ] Workshops and intensives ($30-80/person)
- [ ] Teacher training programs (200-hour: $2,500-3,500)
- [ ] Retreats (day retreats: $150-250, weekend: $400-800)
- [ ] Online class subscriptions ($15-30/month)
- [ ] Retail (mats, props, apparel, books)

### Target Market Analysis

#### Primary Target Market (60% of business)
**Health-Conscious Adults (25-45 years)**
- Demographics: Middle to upper-middle income, college-educated
- Psychographics: Values wellness, work-life balance, personal growth
- Pain Points: Stress, physical tension, lack of community
- Yoga Experience: Beginner to intermediate
- Spending Behavior: Willing to invest in health and wellness

#### Secondary Target Market (25% of business)
**Active Seniors (50+ years)**
- Demographics: Empty nesters, retirees, health-focused
- Psychographics: Seeking gentle exercise, social connection
- Pain Points: Joint stiffness, isolation, health concerns
- Yoga Experience: Mostly beginners
- Spending Behavior: Value-conscious but loyal once committed

#### Tertiary Target Market (15% of business)
**Young Professionals (22-35 years)**
- Demographics: Recent graduates, career-focused
- Psychographics: Busy lifestyle, stress management needs
- Pain Points: Long work hours, technology overload, anxiety
- Yoga Experience: Varied, attracted to convenience
- Spending Behavior: Budget-conscious, class packages over memberships

### Unique Value Proposition
*"The only studio in [Your Area] offering trauma-informed yoga teacher training, sliding-scale community classes, and specialized programming for underserved populations, all in a beautifully designed space that prioritizes accessibility and inclusion."*

[Define what makes your studio uniquely valuable to your community]

---

## MARKET ANALYSIS

### Local Market Research

#### Market Size Calculation
**Total Population in 5-mile radius:** [X]
**Target Demographics (ages 25-65):** [X] people ([X]% of population)
**Estimated Yoga Practitioners:** [X] people (using 15% participation rate)
**Market Penetration Goal:** [X]% = [X] potential customers

#### Economic Factors
- **Median Household Income:** $[X]
- **Disposable Income Trends:** [Increasing/Stable/Declining]
- **Health & Wellness Spending:** $[X] per capita annually
- **Competition for Discretionary Spending:** Gyms, spas, entertainment

### Competitor Analysis

#### Direct Competitors

**[Competitor 1 Name]**
- **Location:** [Address and distance from your location]
- **Strengths:** Established reputation, large space, multiple instructors
- **Weaknesses:** Higher prices, limited beginner options, parking issues
- **Pricing:** Drop-in $28, 10-class package $240, Unlimited $140/month
- **Differentiators:** We offer more beginner-friendly classes and sliding scale options

**[Competitor 2 Name]**
- **Location:** [Address and distance]  
- **Strengths:** Modern facility, hot yoga specialty, strong social media
- **Weaknesses:** Intimidating for beginners, narrow focus, limited community programs
- **Pricing:** Drop-in $25, packages $200-350, Unlimited $125/month
- **Differentiators:** We focus on inclusivity and trauma-informed teaching

**[Competitor 3 Name]**
- **Location:** [Address and distance]
- **Strengths:** Low prices, convenient location, established clientele
- **Weaknesses:** Outdated facility, limited class variety, inconsistent quality
- **Pricing:** Drop-in $18, packages $150-250, Unlimited $89/month
- **Differentiators:** We offer higher quality instruction and better facilities

#### Indirect Competitors
- **Traditional Gyms:** LA Fitness, Planet Fitness (offer basic yoga classes)
- **Boutique Fitness:** Pure Barre, SoulCycle (compete for same demographic)
- **Wellness Centers:** Spas, massage therapy, alternative health practitioners
- **Online Platforms:** YouTube, yoga apps, virtual class subscriptions

### SWOT Analysis

#### Strengths
- Founder's extensive training and teaching experience (500-hour RYT, trauma-informed certification)
- Prime location with high visibility and foot traffic
- Comprehensive business plan with realistic financial projections
- Strong community connections and initial student base
- Diverse programming addressing underserved populations

#### Weaknesses  
- New business without established reputation
- Limited initial capital requiring careful cash flow management
- Dependence on founder's presence and teaching
- Competition from established studios
- Seasonal fluctuations in attendance

#### Opportunities
- Growing awareness of yoga's mental health benefits
- Increased demand for trauma-informed and accessible yoga
- Corporate wellness program expansion
- Online/hybrid class offerings post-pandemic
- Partnership opportunities with healthcare providers

#### Threats
- Economic downturn affecting discretionary spending
- New competitors entering the market
- Instructor turnover and recruitment challenges
- Liability and insurance concerns
- Changing health regulations or restrictions

---

## ORGANIZATION & MANAGEMENT

### Organizational Structure

**Business Structure:** [LLC recommended for liability protection and tax flexibility]

**Management Philosophy:** Collaborative leadership with clear accountability. Foster a culture of continuous learning, inclusivity, and student-centered decision making.

### Leadership Team

#### Founder/Owner: [Your Name]
**Background:** 
- [X] years of yoga practice, [X] years teaching experience
- Certifications: [e.g., E-RYT 500, Trauma-Informed Yoga, Prenatal Certification]
- Business/Education Background: [Relevant experience]
- **Responsibilities:** Overall vision, class instruction, teacher development, community outreach

**Strengths:** [Teaching expertise, business acumen, community connections]
**Areas for Growth:** [Marketing, technology, financial management]

#### Lead Instructor: [Name or "To Be Hired"]
**Qualifications:** RYT-500 with 3+ years teaching experience
**Specializations:** [Vinyasa, alignment-based instruction]
**Responsibilities:** Senior class instruction, substitute coordination, new teacher mentoring

#### Studio Manager: [Name or "To Be Hired"] (Month 6-12)
**Qualifications:** Customer service experience, yoga background preferred
**Responsibilities:** Daily operations, customer service, retail management, social media

#### Advisory Board (Unpaid Positions)
- **Business Mentor:** [Local business owner with retail/service experience]
- **Healthcare Professional:** [Doctor, physical therapist, or mental health practitioner]
- **Marketing Advisor:** [Social media expert or marketing professional]
- **Legal/Financial Advisor:** [Accountant or attorney familiar with small business]

### Staffing Plan

#### Year 1 Staffing
- **Owner/Founder:** Full-time instruction and management
- **Part-time Instructors:** 2-3 qualified teachers (months 3-6)
- **Front Desk Support:** Part-time position (months 6-9)

#### Year 2-3 Growth
- **Studio Manager:** Full-time operations role
- **Additional Instructors:** 4-6 part-time teachers
- **Specialized Instructors:** Prenatal, senior, trauma-informed specialists

### Compensation Structure
- **Instructor Rate:** $40-75/class based on experience and attendance
- **Private Session Split:** 60% instructor, 40% studio
- **Workshop Teaching:** $75-150/workshop
- **Administrative Duties:** $20-25/hour for experienced teachers

---

## SERVICES & PRICING STRATEGY

### Class Schedule Development

#### Weekly Schedule Template (25-35 classes/week)

| Time | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday | Sunday |
|------|--------|---------|-----------|----------|--------|----------|--------|
| 6:00 AM | | | Morning Flow (45min) | | | | |
| 7:00 AM | Gentle Hatha (60min) | | Gentle Hatha (60min) | | Morning Vinyasa (60min) | | |
| 8:30 AM | | | | | | Power Vinyasa (75min) | Slow Flow (75min) |
| 9:30 AM | | Prenatal (60min) | | Senior Yoga (45min) | | Beginner Workshop (90min) | |
| 10:30 AM | | | | | | Community Class (60min) | Restorative (90min) |
| 12:00 PM | Lunch Flow (45min) | Power Vinyasa (60min) | Lunch Flow (45min) | Yin Yoga (75min) | Power Vinyasa (60min) | | |
| 4:30 PM | | | | | | Hot 26 (90min) | |
| 5:30 PM | | | | | | | Gentle Flow (60min) |
| 6:00 PM | Vinyasa Flow (75min) | Hot Yoga (60min) | Vinyasa Flow (75min) | Hot Yoga (60min) | | | |
| 7:30 PM | Yin Yoga (75min) | | Restorative (90min) | | | | |

**Class Capacity Planning:**
- Average class size goal: 8-12 students
- Maximum capacity: 20 students
- Break-even per class: 6 students (based on $25 average revenue per student)

### Comprehensive Pricing Structure

#### Drop-In Rates
- **Single Class:** $28 (competitive with premium studios)
- **New Student Special:** First class $20, First week unlimited $39
- **Student/Senior Discount:** $22 (with valid ID)
- **Teacher/Healthcare Worker:** $22 (professional courtesy)

#### Class Packages (Build loyalty and improve cash flow)
- **5-Class Package:** $125 ($25/class, expires 4 months)
- **10-Class Package:** $220 ($22/class, expires 6 months) *Most popular*
- **20-Class Package:** $380 ($19/class, expires 12 months) *Best value*

#### Membership Options
- **Monthly Unlimited:** $140/month (auto-renew, 30-day notice to cancel)
- **Annual Membership:** $1,400 ($116.67/month - 2 months free)
- **6-Month Membership:** $750 ($125/month - 1 month free)

#### Specialty Services
- **Private Lessons:** $90/hour (intro rate), $110/hour (regular)
- **Semi-Private (2 people):** $65/person
- **Small Group (3-4 people):** $45/person

#### Workshops & Events
- **2-Hour Workshop:** $45-65 depending on topic and instructor
- **Half-Day Intensive (4 hours):** $125-150
- **Day Retreat:** $175-225 (includes lunch, materials)
- **Weekend Workshop Series:** $350-450

#### Corporate Programs
- **On-Site Classes:** $300/class (up to 15 participants)
- **Studio Corporate Rate:** $20/person (minimum 5 people)
- **Executive Wellness Package:** $2,500/month (4 weekly sessions)

### Pricing Psychology & Strategy

#### Value-Based Pricing Rationale
Our pricing reflects the true value of professional instruction, premium facility, and transformative experience. Consider:
- **Cost per month of daily practice:** $4.67 (unlimited membership ÷ 30 days)
- **Comparable therapy session:** $150-200/hour vs. yoga class $28
- **Gym membership comparison:** Similar monthly cost but includes mind-body benefits

#### Promotional Strategies
- **Referral Program:** Existing student gets $20 credit, new student gets first class $15
- **Birthday Month:** 50% off class packages during birthday month
- **Seasonal Promotions:** "New Year, New Practice" packages in January
- **Community Appreciation:** Free community class monthly (donation-based)

---

## MARKETING & SALES STRATEGY

### Brand Positioning
**Brand Promise:** "Accessible yoga instruction that meets you where you are, supporting your journey toward greater health, happiness, and connection."

**Brand Values:**
- **Inclusivity:** All bodies, all budgets, all experience levels welcome
- **Authenticity:** Honest, down-to-earth approach to yoga and wellness
- **Community:** Building genuine connections between students and teachers
- **Growth:** Supporting continuous learning and personal development

### Marketing Goals & Objectives

#### Year 1 Targets
1. **Build Brand Awareness:** 70% of target demographic recognizes studio name
2. **Email List Growth:** 500 subscribers in first 6 months, 1,000 by year-end
3. **Social Media Following:** 1,500 Instagram followers, 800 Facebook followers
4. **Student Acquisition:** 300 unique students try classes, 150 become regular attendees
5. **Retention Rate:** 75% of students attend second class, 60% purchase packages

#### Marketing Budget Allocation (Monthly: $800-1,200)
- **Digital Advertising:** 40% ($320-480) - Facebook, Instagram, Google Ads
- **Content Creation:** 25% ($200-300) - Photography, videography, design
- **Print/Local Marketing:** 20% ($160-240) - Flyers, local magazine ads
- **Events/Community Outreach:** 10% ($80-120) - Sponsorships, free classes
- **Email Marketing/Software:** 5% ($40-60) - Mailchimp, scheduling tools

### Marketing Channels & Tactics

#### Digital Marketing Strategy

**Website Optimization**
- **SEO Focus:** "Yoga [Your City]", "Beginner Yoga Classes", "Trauma-Informed Yoga"
- **Content Marketing:** Weekly blog posts on yoga tips, student stories, health benefits
- **Online Booking:** Seamless class reservation and payment system
- **Virtual Class Options:** Live-stream and on-demand class library

**Social Media Strategy**
- **Instagram (Primary):** Daily posts featuring poses, tips, behind-the-scenes content
- **Facebook:** Community building, event promotion, longer-form educational content
- **TikTok:** Quick yoga tips, pose tutorials, trending audio with yoga content
- **YouTube:** Longer instructional videos, student testimonials, virtual classes

**Email Marketing Campaigns**
- **Welcome Series:** 5-email sequence for new subscribers
- **Weekly Newsletter:** Class highlights, yoga tips, community spotlights
- **Promotional Emails:** New student specials, workshop announcements
- **Retention Campaigns:** Win-back sequences for lapsed students

#### Local Community Marketing

**Partnership Development**
- **Healthcare Providers:** Physical therapy clinics, mental health practitioners
- **Local Businesses:** Coffee shops, health food stores, wellness centers
- **Schools/Universities:** Teacher wellness programs, student stress relief
- **Corporate Clients:** Employee wellness initiatives

**Community Engagement**
- **Free Monthly Community Class:** Donation-based, open to all levels
- **Outdoor Yoga Events:** Park classes, beach sessions (seasonal)
- **Health Fairs & Festivals:** Booth presence, mini-classes, giveaways
- **Local Media:** Newspaper interviews, radio appearances, podcast guests

#### Grand Opening Marketing Campaign (Months 1-3)

**Pre-Opening (6 weeks before)**
- Social media teasers and behind-the-scenes content
- Email list building with "Founding Member" special offers
- Local media outreach and press releases
- Partnership announcements and cross-promotion

**Grand Opening Week**
- **Free Community Classes:** One free class per day for opening week
- **Open House Events:** Studio tours, meet the teachers, light refreshments
- **Founding Member Special:** Unlimited month for $89 (first 100 people)
- **Local Influencer Event:** Invite local wellness influencers for special class

**Post-Opening (Weeks 2-12)**
- **New Student Special:** First month unlimited for $99 (ongoing)
- **Referral Incentives:** Enhanced rewards for bringing friends
- **Workshop Series:** Weekly workshops on different yoga styles
- **Community Challenges:** 30-day yoga challenge with prizes

### Customer Acquisition Funnel

#### Awareness Stage
- **Tactics:** Social media advertising, local PR, community events
- **Metrics:** Website traffic, social media reach, brand recognition surveys
- **Goal:** Generate interest in yoga and awareness of studio

#### Consideration Stage  
- **Tactics:** Free community classes, new student specials, email nurture sequences
- **Metrics:** Email signups, class bookings, workshop attendance
- **Goal:** Build trust and demonstrate value proposition

#### Trial Stage
- **Tactics:** First-class discounts, beginner-friendly offerings, personal attention
- **Metrics:** First-class completion rate, immediate feedback scores
- **Goal:** Provide excellent first experience that encourages return

#### Conversion Stage
- **Tactics:** Package incentives, membership benefits, community building
- **Metrics:** Package purchase rate, membership conversions, retention rates  
- **Goal:** Transform trial students into regular, paying community members

#### Retention & Advocacy Stage
- **Tactics:** Loyalty programs, advanced workshops, teacher training opportunities
- **Metrics:** Lifetime value, referral rates, online reviews and testimonials
- **Goal:** Create loyal advocates who refer others and support business growth

---

## FINANCIAL PROJECTIONS & ANALYSIS

### Startup Costs Breakdown

#### Initial Investment Requirements

**Facility Setup & Equipment**
| Item | Cost | Notes |
|------|------|-------|
| First/Last Month Rent + Security | $4,500 | $1,500/month rent |
| Studio Build-out & Renovation | $8,000 | Flooring, mirrors, lighting |
| Sound System & AV Equipment | $2,500 | Professional speakers, microphones |
| Yoga Equipment (mats, blocks, etc.) | $1,500 | 25 mats, 50 blocks, props |
| Reception Area Setup | $3,000 | Desk, seating, retail display |
| Storage & Miscellaneous | $1,000 | Shelving, cleaning supplies |
| **Facilities Subtotal** | **$20,500** |  |

**Technology & Software**
| Item | Cost | Notes |
|------|------|-------|
| Website Development | $3,000 | Professional design with booking |
| Booking Software Setup | $500 | MindBody or similar platform |
| POS System | $800 | Square or similar for retail |
| Security System | $1,200 | Cameras, alarms, access control |
| **Technology Subtotal** | **$5,500** |  |

**Legal, Professional & Administrative**
| Item | Cost | Notes |
|------|------|-------|
| Business Registration & Licenses | $500 | LLC filing, business licenses |
| Insurance (Annual Premium) | $2,400 | Liability, property, business |
| Legal Consultation | $1,500 | Contract review, lease negotiation |
| Accounting Setup | $800 | QuickBooks, initial bookkeeping |
| **Legal/Admin Subtotal** | **$5,200** |  |

**Marketing & Launch**
| Item | Cost | Notes |
|------|------|-------|
| Branding & Logo Design | $2,000 | Professional brand development |
| Initial Marketing Materials | $1,000 | Flyers, business cards, signage |
| Grand Opening Campaign | $2,500 | Advertising, event costs |
| Photography/Videography | $1,500 | Professional studio and action shots |
| **Marketing Subtotal** | **$7,000** |  |

**Working Capital & Contingency**
| Item | Cost | Notes |
|------|------|-------|
| Operating Capital (3 months) | $15,000 | Rent, utilities, basic expenses |
| Inventory (Retail) | $3,000 | Mats, props, apparel, books |
| Emergency Fund | $5,000 | Unexpected expenses buffer |
| **Working Capital Subtotal** | **$23,000** |  |

#### Total Startup Investment: $61,200

### Revenue Projections

#### Monthly Revenue Projections (Year 1)

**Month 1-3: Soft Opening Phase**
- Average Students per Month: 150 unique, 350 total visits
- Average Revenue per Visit: $22
- Monthly Revenue: $7,700
- Growth Rate: 25% month-over-month

**Month 4-6: Establishment Phase**  
- Average Students per Month: 220 unique, 550 total visits
- Average Revenue per Visit: $24
- Monthly Revenue: $13,200
- Growth Rate: 15% month-over-month

**Month 7-12: Growth Phase**
- Average Students per Month: 280 unique, 750 total visits
- Average Revenue per Visit: $26
- Monthly Revenue: $19,500
- Growth Rate: 8% month-over-month

#### Revenue Stream Breakdown (Monthly at Full Operation)

| Revenue Source | % of Total | Monthly Amount | Notes |
|---------------|------------|----------------|-------|
| Class Packages | 45% | $8,775 | Primary revenue driver |
| Unlimited Memberships | 25% | $4,875 | Recurring revenue base |
| Drop-in Classes | 15% | $2,925 | Convenience premium |
| Private Sessions | 8% | $1,560 | High-margin service |
| Workshops & Events | 4% | $780 | Growth opportunity |
| Retail Sales | 2% | $390 | Supplemental income |
| Corporate Programs | 1% | $195 | Future growth area |
| **Total Monthly Revenue** | **100%** | **$19,500** | **Month 12 target** |

### Expense Projections

#### Fixed Monthly Expenses
| Category | Amount | Notes |
|----------|--------|-------|
| Rent | $1,500 | Base studio space |
| Insurance | $200 | Liability, property coverage |
| Utilities | $150 | Electric, water, internet |
| Software Subscriptions | $180 | Booking, accounting, email |
| Bank & Processing Fees | $120 | Credit card processing |
| **Fixed Expenses Total** | **$2,150** |  |

#### Variable Monthly Expenses (at full operation)
| Category | Amount | % of Revenue | Notes |
|----------|--------|--------------|-------|
| Instructor Payments | $6,500 | 33% | $50 average per class |
| Owner Salary | $3,500 | 18% | Reinvested in business |
| Marketing & Advertising | $1,000 | 5% | Digital and local marketing |
| Retail Cost of Goods | $200 | 1% | Props and merchandise |
| Supplies & Maintenance | $300 | 1.5% | Cleaning, repairs, props |
| Professional Services | $250 | 1.3% | Accounting, legal advice |
| **Variable Expenses Total** | **$11,750** | **60.3%** |  |

#### Total Monthly Expenses: $13,900
#### Monthly Net Profit (Month 12): $5,600 (28.7% margin)

### Break-Even Analysis

**Fixed Costs per Month:** $2,150
**Variable Cost per Student Visit:** $15.67 (instructor pay, supplies, processing)
**Average Revenue per Student Visit:** $26

**Break-Even Formula:** Fixed Costs ÷ (Revenue per visit - Variable cost per visit)
**Break-Even Point:** $2,150 ÷ ($26 - $15.67) = **208 student visits per month**

**Monthly Break-Even Revenue:** $5,408
**Expected Break-Even Month:** Month 4 (when hitting 350+ visits/month)

### 3-Year Financial Projections

#### Year 1 Summary
- **Total Revenue:** $156,000
- **Total Expenses:** $142,800
- **Net Profit:** $13,200 (8.5% margin)
- **Owner Salary:** $36,000

#### Year 2 Projections
- **Monthly Revenue Growth:** 15% increase to $22,425/month
- **Total Revenue:** $269,100  
- **Total Expenses:** $215,280
- **Net Profit:** $53,820 (20% margin)
- **Owner Salary:** $48,000

#### Year 3 Projections  
- **Monthly Revenue Growth:** 10% increase to $24,668/month
- **Total Revenue:** $296,016
- **Total Expenses:** $236,813
- **Net Profit:** $59,203 (20% margin)
- **Owner Salary:** $60,000

### Cash Flow Projections

#### Critical Cash Flow Periods
- **Months 1-3:** Negative cash flow expected, drawing from working capital
- **Month 4:** Approaching break-even, cash flow stabilizing
- **Months 6-12:** Positive cash flow, beginning loan repayment
- **Year 2+:** Strong positive cash flow, expansion capital available

#### Seasonal Considerations
- **January:** 25% increase (New Year resolutions)
- **April-May:** 10% increase (summer prep)
- **July-August:** 15% decrease (vacation season)
- **September:** 20% increase (back-to-school routine)
- **December:** 10% decrease (holiday season)

---

## FUNDING REQUEST & USE OF FUNDS

### Total Funding Needed: $61,200

### Funding Sources Strategy

#### Option 1: Personal Investment + Small Business Loan
- **Personal Investment:** $25,000 (41%)
- **SBA Loan:** $36,200 (59%)
- **Loan Terms:** 7 years at 8.5% interest
- **Monthly Payment:** $565

#### Option 2: Personal Investment + Investor Partnership
- **Personal Investment:** $30,000 (49%)
- **Silent Partner Investment:** $31,200 (51%)
- **Partnership Terms:** 25% equity for investor, no management role

#### Option 3: Personal Savings + Equipment Financing
- **Personal Investment:** $45,000 (74%)
- **Equipment Financing:** $16,200 (26%)
- **Equipment Loan:** 5 years at 12% interest for sound system, POS, furniture

### Detailed Use of Funds

**Facility & Equipment (60%): $36,700**
- Immediate need for functional studio space
- Professional-grade equipment ensures safety and quality
- Build-out creates professional, welcoming environment

**Technology & Systems (13%): $8,200**
- Modern booking system essential for operations
- Professional website drives marketing and bookings
- POS system enables retail and efficient payment processing

**Marketing & Branding (11%): $7,000**
- Critical for successful launch and student acquisition
- Professional branding builds credibility and trust
- Grand opening campaign drives initial student base

**Working Capital (16%): $9,300**
- Ensures ability to operate during initial low-revenue months
- Provides cash flow stability while building student base
- Allows focus on teaching quality rather than financial stress

### Return on Investment Timeline

**Loan Repayment Schedule (7-year SBA loan)**
- **Year 1:** $6,780 in payments (break-even with operations)
- **Years 2-3:** Strong cash flow supports comfortable payments
- **Years 4-7:** Loan payments become smaller portion of growing revenue

**Break-Even on Initial Investment**
- **Month 4:** Operational break-even (covering monthly expenses)
- **Month 18:** Full recovery of initial investment through cumulative profits
- **Year 3:** Investment fully recovered with strong ongoing profitability

---

## RISK ANALYSIS & MITIGATION

### Business Risk Assessment

#### High-Risk Factors

**1. Market Competition**
- **Risk:** Established studios, new entrants, price wars
- **Probability:** High (competitive market)
- **Impact:** Medium (could reduce pricing power and student acquisition)
- **Mitigation:** 
  - Focus on differentiation through specializations (trauma-informed, accessibility)
  - Build strong community relationships and loyalty programs
  - Maintain competitive but sustainable pricing structure
  - Continuously improve service quality and student experience

**2. Economic Recession**
- **Risk:** Reduced discretionary spending on wellness services
- **Probability:** Medium (economic cycles are inevitable)
- **Impact:** High (could significantly reduce revenue)
- **Mitigation:**
  - Diversify pricing options including sliding scale and work-study programs
  - Develop lower-cost online class offerings
  - Create essential wellness positioning vs. luxury service
  - Build corporate partnerships for stable revenue streams

**3. Instructor Dependence**
- **Risk:** Key instructor departure, difficulty recruiting quality teachers
- **Probability:** Medium (competitive instructor market)
- **Impact:** Medium (could disrupt classes and student satisfaction)
- **Mitigation:**
  - Develop multiple skilled instructors rather than relying on one
  - Create positive work environment with competitive compensation
  - Offer continuing education and career development opportunities
  - Maintain substitute teacher network and cross-training

#### Medium-Risk Factors

**4. Seasonal Revenue Fluctuations**
- **Risk:** Summer and holiday season attendance drops
- **Probability:** High (predictable pattern)
- **Impact:** Low-Medium (manageable with planning)
- **Mitigation:**
  - Plan for seasonal variations in cash flow projections
  - Develop summer-specific programming (outdoor classes, workshops)
  - Offer annual memberships to smooth revenue
  - Create special holiday packages and gift certificates

**5. Liability and Insurance Issues**
- **Risk:** Student injury, property damage, lawsuits
- **Probability:** Low (with proper precautions)
- **Impact:** High (could be financially devastating)
- **Mitigation:**
  - Comprehensive liability insurance with adequate coverage limits
  - Proper waiver and intake form procedures
  - Well-trained instructors with current certifications
  - Regular equipment maintenance and safety protocols
  - Clear emergency procedures and first aid training

**6. Technology and Systems Failures**
- **Risk:** Booking system downtime, payment processing issues
- **Probability:** Medium (technology dependency)
- **Impact:** Medium (operational disruption, customer frustration)
- **Mitigation:**
  - Choose reliable, established software providers
  - Maintain backup systems and manual procedures
  - Regular data backup and security measures
  - Staff training on troubleshooting common issues

#### Low-Risk Factors

**7. Regulatory Changes**
- **Risk:** New health regulations, business license requirements
- **Probability:** Low (stable regulatory environment)
- **Impact:** Low-Medium (compliance costs)
- **Mitigation:**
  - Stay informed of industry regulations and local requirements
  - Maintain relationships with local health department
  - Budget for potential compliance costs
  - Professional association membership for regulatory updates

### Crisis Management Planning

#### Emergency Procedures
- **Natural Disasters:** Evacuation plans, communication protocols, insurance claims
- **Health Emergencies:** Student injury response, emergency contact procedures
- **Pandemic Response:** Virtual class capabilities, health safety protocols
- **Financial Crisis:** Emergency funding sources, expense reduction plan

#### Business Continuity Plan
- **Revenue Protection:** Online class offerings, outdoor alternatives
- **Student Communication:** Email, social media, phone tree for emergencies
- **Staff Support:** Clear policies for illness, family emergencies
- **Vendor Relationships:** Backup suppliers, flexible payment terms

---

## GROWTH STRATEGY & EXIT PLANNING

### Year 1 Goals & Milestones

#### Operational Milestones
- **Month 1:** Grand opening with 50+ founding members
- **Month 3:** 200 students have tried classes, 100 regular attendees
- **Month 6:** Break-even operations, positive cash flow
- **Month 9:** 300 students in database, 150 active monthly
- **Month 12:** 400 students total, 200 active monthly, profitable operations

#### Financial Targets
- **Month 6:** $12,000 monthly revenue
- **Month 12:** $19,500 monthly revenue
- **Year 1 Total:** $156,000 revenue, $13,200 net profit

#### Community Engagement Goals
- **Monthly Community Classes:** 50+ attendees average
- **Workshop Attendance:** 20+ students per workshop
- **Email List:** 1,000 subscribers by year-end
- **Social Media:** 1,500 Instagram followers, 800 Facebook

### 3-Year Expansion Plan

#### Year 2: Establishment & Enhancement
- **Second Instructor:** Hire experienced teacher to expand class offerings
- **Specialized Programs:** Launch prenatal series, senior yoga, trauma-informed classes
- **Teacher Training:** Begin 200-hour certification program (additional $25,000 annual revenue)
- **Corporate Expansion:** Secure 3-5 regular corporate clients
- **Retail Growth:** Expand retail offerings, improve margins

#### Year 3: Market Leadership & Innovation  
- **Studio Manager:** Hire full-time manager to handle operations
- **Advanced Programming:** 300-hour teacher training, specialized workshops
- **Community Partnerships:** Healthcare provider referral network
- **Online Platform:** Comprehensive virtual class library and app
- **Second Location Evaluation:** Market research for expansion opportunity

### Long-Term Vision (Years 4-7)

#### Expansion Opportunities
- **Second Studio Location:** Serve different geographic area or demographic
- **Retreat Center:** Partner with or develop dedicated retreat facility  
- **Franchise Model:** Develop systems for licensing studio concept
- **Online Education:** Comprehensive teacher training and student education platform

#### Revenue Diversification
- **Product Lines:** Private label yoga props, apparel, wellness products
- **Publishing:** Yoga instruction books, meditation guides, wellness content
- **Consulting:** Help other studios develop trauma-informed and accessible programs
- **Corporate Wellness:** Expand to full workplace wellness consulting

### Exit Strategy Options

#### Option 1: Lifestyle Business (Years 5-10)
- **Goal:** Maintain profitable studio providing comfortable lifestyle
- **Structure:** Owner continues teaching and management role
- **Income:** $80,000-120,000 annual owner compensation
- **Benefits:** Creative fulfillment, community impact, flexible schedule

#### Option 2: Sale to Strategic Buyer (Years 5-7)
- **Potential Buyers:** Larger yoga studio chain, wellness company, private equity
- **Valuation:** 2-4x annual revenue ($500,000-1,000,000 potential)
- **Structure:** Asset sale or business acquisition
- **Timeline:** Begin preparation 2 years before intended sale

#### Option 3: Management Buyout (Years 3-5)
- **Structure:** Sell to studio manager or lead instructor
- **Benefits:** Ensure continued community focus and values alignment
- **Financing:** Seller financing with gradual transition
- **Owner Role:** Consulting or limited teaching role

#### Option 4: Franchise Development (Years 7-10)
- **Model:** License studio concept and systems to other markets
- **Revenue:** Franchise fees plus ongoing royalties
- **Growth:** Potential for regional or national expansion
- **Requirements:** Proven profitability, systematic operations, strong brand

---

## IMPLEMENTATION TIMELINE

### Pre-Opening Phase (Months -6 to -1)

#### Months -6 to -4: Foundation Building
**Legal & Administrative**
- [ ] Business registration and legal structure setup
- [ ] Secure business insurance and liability coverage
- [ ] Open business bank accounts and credit lines
- [ ] Apply for necessary business licenses and permits

**Location & Lease**
- [ ] Sign lease agreement and secure space
- [ ] Begin renovation and build-out process
- [ ] Install flooring, mirrors, and lighting
- [ ] Set up sound system and technical equipment

**Business Systems**
- [ ] Select and implement booking software (MindBody, Glofox)
- [ ] Develop website with online booking capability
- [ ] Set up payment processing and POS system
- [ ] Create initial class schedules and pricing structure

#### Months -3 to -1: Marketing & Staff Preparation
**Branding & Marketing**
- [ ] Complete brand development and logo design
- [ ] Launch website and social media accounts
- [ ] Begin pre-opening email list building
- [ ] Develop grand opening marketing campaign

**Staff Recruitment**
- [ ] Recruit and hire initial teaching staff
- [ ] Conduct teacher training and orientation
- [ ] Develop class descriptions and style guidelines
- [ ] Create staff handbook and policies

**Operations Setup**
- [ ] Install equipment and set up studio space
- [ ] Stock retail inventory and prop supplies
- [ ] Test all systems and equipment
- [ ] Plan grand opening week events and schedule

### Opening Phase (Months 1-3)

#### Month 1: Grand Opening
**Week 1: Soft Opening**
- [ ] Invite friends, family, and preview members
- [ ] Test run all systems and identify issues
- [ ] Gather feedback and make adjustments
- [ ] Train staff on day-to-day operations

**Week 2-4: Public Launch**
- [ ] Official grand opening with community events
- [ ] Free community classes and open houses
- [ ] Launch new student specials and promotions
- [ ] Begin regular class schedule

#### Months 2-3: Establishing Operations
- [ ] Monitor class attendance and adjust schedule as needed
- [ ] Implement feedback systems and gather student input
- [ ] Refine teaching quality and class offerings
- [ ] Build email list and social media following
- [ ] Track financial performance against projections

### Growth Phase (Months 4-12)

#### Months 4-6: Building Momentum
- [ ] Expand class schedule based on demand
- [ ] Launch workshop and special event programming
- [ ] Implement referral and loyalty programs
- [ ] Begin corporate outreach and partnership development
- [ ] Evaluate financial performance and adjust strategies

#### Months 7-9: Optimization
- [ ] Hire additional instructors as needed
- [ ] Expand retail offerings and improve margins
- [ ] Launch teacher training interest list
- [ ] Develop deeper community partnerships
- [ ] Plan for seasonal programming and promotions

#### Months 10-12: Preparation for Year 2
- [ ] Evaluate year 1 performance against goals
- [ ] Plan year 2 expansion strategies
- [ ] Consider studio manager hiring
- [ ] Develop teacher training program curriculum
- [ ] Begin planning for potential second location research

---

## APPENDICES

### Appendix A: Market Research Data

#### Local Demographic Analysis
**Population within 5-mile radius:** [Insert your area's data]
- Total population: [X]
- Median age: [X] years
- Median household income: $[X]
- Education level: [X]% college-educated
- Health & wellness spending: $[X] per capita

#### Competitor Analysis Details
[Include detailed competitor research with pricing, class schedules, and differentiation analysis]

### Appendix B: Financial Statements & Projections

#### Detailed Monthly Cash Flow Projections
[Include month-by-month cash flow for first 24 months]

#### Break-Even Analysis by Service Type
[Show break-even calculations for each revenue stream]

#### Sensitivity Analysis
[Model different scenarios: optimistic, realistic, pessimistic]

### Appendix C: Marketing Materials & Brand Guidelines

#### Brand Identity Package
- Logo variations and usage guidelines
- Color palette and typography standards
- Voice and messaging guidelines
- Photography style guide

#### Sample Marketing Materials
- Class schedule template
- Workshop promotion examples
- Email marketing templates
- Social media content calendar

### Appendix D: Operational Documents

#### Standard Operating Procedures
- Daily opening/closing checklists
- Class setup and breakdown procedures
- Student intake and registration process
- Emergency procedures and safety protocols

#### Staff Training Materials
- Teacher guidelines and expectations
- Customer service standards
- Sales and retention training
- Professional development requirements

### Appendix E: Legal Documentation

#### Template Contracts & Forms
- Student liability waiver and health questionnaire
- Instructor agreement template
- Corporate client contract template
- Workshop and event agreements

#### Insurance and Risk Management
- Insurance policy summaries and coverage details
- Risk management procedures
- Incident reporting forms
- Emergency contact and medical information

---

## CONCLUSION

This comprehensive business plan provides a roadmap for launching and operating a successful yoga studio that serves the community while building a sustainable, profitable business. The plan balances ambitious growth goals with realistic financial projections and emphasizes the values of inclusivity, quality instruction, and community building that are essential to long-term success in the wellness industry.

### Key Success Factors

1. **Clear Differentiation:** Focus on trauma-informed, accessible yoga sets the studio apart from competitors
2. **Financial Sustainability:** Conservative projections and diversified revenue streams protect against market fluctuations
3. **Community Focus:** Building genuine relationships and serving underserved populations creates loyal, engaged students
4. **Quality Instruction:** Investment in ongoing teacher development ensures excellent student experiences
5. **Systematic Growth:** Planned expansion based on proven profitability rather than aggressive scaling

### Next Steps

1. **Secure Funding:** Present this plan to potential lenders or investors
2. **Location Scouting:** Find the ideal space that meets budget and demographic requirements
3. **Legal Setup:** Complete business registration and insurance requirements
4. **Team Building:** Begin recruiting founding instructors and advisory board members
5. **Community Engagement:** Start building relationships and email list before opening

Remember that this business plan is a living document that should be reviewed and updated regularly as the business grows and market conditions change. The yoga industry's continued growth, combined with increasing awareness of mental health and wellness needs, creates an excellent opportunity for a well-planned, community-focused studio to thrive.

**Success in the yoga business comes not just from teaching great classes, but from creating a space where people feel seen, supported, and inspired to grow. This business plan provides the framework—your passion, dedication, and authentic connection with students will bring it to life.**`;
}

// Generate Financial Tracking Spreadsheet CSV
export function generateFinancialTrackingSpreadsheet(): string {
  const headers = [
    'Date', 'Description', 'Category', 'Subcategory', 'Income', 'Expense', 'Payment Method', 
    'Tax Deductible', 'Client/Vendor', 'Notes', 'Running Balance', 'Monthly Total'
  ];
  
  const sampleData = [
    // January 2024 - Studio Opening Month
    ['2024-01-01', 'Opening Balance', 'Initial Capital', 'Startup Investment', '10000.00', '', 'Bank Transfer', 'No', 'Owner Investment', 'Initial studio funding', '10000.00', ''],
    ['2024-01-02', 'Studio Rent - First Month', 'Fixed Expenses', 'Rent', '', '1500.00', 'Bank Transfer', 'Yes', 'Yoga Space Rentals LLC', 'January rent payment', '8500.00', ''],
    ['2024-01-02', 'Security Deposit', 'Startup Costs', 'Deposits', '', '1500.00', 'Bank Transfer', 'Yes', 'Yoga Space Rentals LLC', 'Refundable security deposit', '7000.00', ''],
    ['2024-01-03', 'Liability Insurance', 'Fixed Expenses', 'Insurance', '', '125.00', 'Credit Card', 'Yes', 'Yoga Alliance Insurance', 'Monthly liability coverage', '6875.00', ''],
    ['2024-01-03', 'Yoga Mats (20 units)', 'Equipment', 'Props', '', '400.00', 'Credit Card', 'Yes', 'Yoga Outlet', 'Student mats - eco-friendly', '6475.00', ''],
    ['2024-01-04', 'Blocks & Bolsters', 'Equipment', 'Props', '', '350.00', 'Credit Card', 'Yes', 'Manduka', 'Cork blocks, yoga bolsters', '6125.00', ''],
    ['2024-01-04', 'Sound System', 'Equipment', 'Audio/Visual', '', '800.00', 'Credit Card', 'Yes', 'Bose', 'Wireless speaker system', '5325.00', ''],
    ['2024-01-05', 'Website Setup', 'Marketing', 'Digital', '', '500.00', 'Credit Card', 'Yes', 'WebFlow Studio', 'Professional website design', '4825.00', ''],
    ['2024-01-06', 'Business License', 'Legal/Admin', 'Licenses', '', '150.00', 'Check', 'Yes', 'City Business Office', 'Annual business license', '4675.00', ''],
    ['2024-01-08', 'Grand Opening Workshop', 'Class Revenue', 'Workshops', '450.00', '', 'Mixed Payments', 'No', 'Multiple Students', '15 students × $30 intro workshop', '5125.00', ''],
    ['2024-01-09', 'Class Package - Sarah M.', 'Class Revenue', 'Packages', '150.00', '', 'Credit Card', 'No', 'Sarah Mitchell', '10-class package', '5275.00', ''],
    ['2024-01-09', 'Private Lesson - John D.', 'Class Revenue', 'Private Sessions', '80.00', '', 'Cash', 'No', 'John Davis', '1-hour private session', '5355.00', ''],
    ['2024-01-10', 'Instructor Payment - Lisa', 'Variable Expenses', 'Staff Costs', '', '200.00', 'Cash', 'Yes', 'Lisa Chen, RYT-500', 'Week 1 classes (4 classes)', '5155.00', ''],
    ['2024-01-10', 'Credit Card Processing', 'Variable Expenses', 'Payment Processing', '', '18.75', 'Auto-deduct', 'Yes', 'Square', '2.9% processing fees', '5136.25', ''],
    ['2024-01-11', 'Drop-in Student', 'Class Revenue', 'Drop-ins', '25.00', '', 'Credit Card', 'No', 'Walk-in Student', 'Single class payment', '5161.25', ''],
    ['2024-01-12', 'Utilities - Electric', 'Fixed Expenses', 'Utilities', '', '85.00', 'Bank Transfer', 'Yes', 'City Electric Company', 'January electricity bill', '5076.25', ''],
    ['2024-01-12', 'Internet Service', 'Fixed Expenses', 'Utilities', '', '60.00', 'Auto-pay', 'Yes', 'High-Speed Internet Co', 'Business internet plan', '5016.25', ''],
    ['2024-01-13', '20-Class Package - Jennifer K.', 'Class Revenue', 'Packages', '280.00', '', 'Credit Card', 'No', 'Jennifer Kim', 'Premium package with discount', '5296.25', ''],
    ['2024-01-14', 'Weekend Workshop - Yin Yoga', 'Class Revenue', 'Workshops', '360.00', '', 'Mixed Payments', 'No', 'Multiple Students', '12 students × $30', '5656.25', ''],
    ['2024-01-15', 'Social Media Advertising', 'Marketing', 'Digital', '', '120.00', 'Credit Card', 'Yes', 'Facebook/Instagram', 'January ad campaign', '5536.25', ''],
    ['2024-01-15', 'Google Ads', 'Marketing', 'Digital', '', '100.00', 'Credit Card', 'Yes', 'Google Ads', 'Local search advertising', '5436.25', ''],
    ['2024-01-16', 'Monthly Unlimited - Mike R.', 'Class Revenue', 'Memberships', '120.00', '', 'Auto-pay', 'No', 'Mike Rodriguez', 'Unlimited monthly membership', '5556.25', ''],
    ['2024-01-17', 'Cleaning Supplies', 'Variable Expenses', 'Maintenance', '', '45.00', 'Cash', 'Yes', 'Local Grocery Store', 'Eco-friendly cleaning products', '5511.25', ''],
    ['2024-01-17', 'Instructor Payment - Alex', 'Variable Expenses', 'Staff Costs', '', '150.00', 'Venmo', 'Yes', 'Alex Thompson, RYT-200', 'Week 2 substitute classes', '5361.25', ''],
    ['2024-01-18', 'Retail Sale - Yoga Block', 'Retail Revenue', 'Props', '25.00', '', 'Cash', 'No', 'Regular Student', 'Cork yoga block', '5386.25', ''],
    ['2024-01-19', 'Accounting Software', 'Fixed Expenses', 'Software', '', '29.99', 'Credit Card', 'Yes', 'QuickBooks', 'Monthly subscription', '5356.26', ''],
    ['2024-01-20', 'Booking System', 'Fixed Expenses', 'Software', '', '49.00', 'Credit Card', 'Yes', 'MindBody', 'Class booking platform', '5307.26', ''],
    ['2024-01-22', 'Teacher Training Income', 'Education Revenue', 'Training Programs', '800.00', '', 'Bank Transfer', 'No', 'Teaching Student', 'Month 1 of 200-hr program', '6107.26', ''],
    ['2024-01-23', 'Continuing Education', 'Education', 'Professional Development', '', '200.00', 'Credit Card', 'Yes', 'Yoga Alliance', 'Online workshop attendance', '5907.26', ''],
    ['2024-01-24', 'Corporate Class - TechCorp', 'Class Revenue', 'Corporate', '300.00', '', 'Check', 'No', 'TechCorp HR Dept', 'Weekly on-site corporate class', '6207.26', ''],
    ['2024-01-25', 'Tea & Towel Service', 'Variable Expenses', 'Student Amenities', '', '75.00', 'Credit Card', 'Yes', 'Herbal Tea Company', 'Monthly tea and towel service', '6132.26', ''],
    ['2024-01-26', 'Retail Inventory', 'Inventory', 'Props', '', '300.00', 'Credit Card', 'Yes', 'Various Suppliers', 'Water bottles, straps, eye pillows', '5832.26', ''],
    ['2024-01-27', 'Weekend Intensive', 'Class Revenue', 'Workshops', '600.00', '', 'Mixed Payments', 'No', 'Multiple Students', '10 students × $60 arm balance workshop', '6432.26', ''],
    ['2024-01-28', 'Instructor Training Materials', 'Education', 'Professional Development', '', '150.00', 'Credit Card', 'Yes', 'Yoga Book Publishers', 'Anatomy and teaching books', '6282.26', ''],
    ['2024-01-29', 'Monthly Unlimited - Sarah L.', 'Class Revenue', 'Memberships', '120.00', '', 'Auto-pay', 'No', 'Sarah Lopez', 'Second unlimited member', '6402.26', ''],
    ['2024-01-30', 'End of Month - Instructor Bonus', 'Variable Expenses', 'Staff Costs', '', '100.00', 'Cash', 'Yes', 'Lisa Chen', 'Performance bonus for excellent feedback', '6302.26', ''],
    ['2024-01-31', 'January P&L Summary', 'Administrative', 'Bookkeeping', '', '', 'N/A', 'No', 'Monthly Accounting', 'Revenue: $3,330 | Expenses: $7,027.74 | Net: -$3,697.74', '6302.26', '-3697.74'],
    
    // February 2024 - Growth Month
    ['2024-02-01', 'February Rent', 'Fixed Expenses', 'Rent', '', '1500.00', 'Bank Transfer', 'Yes', 'Yoga Space Rentals LLC', 'February rent payment', '4802.26', ''],
    ['2024-02-01', 'Valentine Workshop Planning', 'Marketing', 'Event Promotion', '', '50.00', 'Credit Card', 'Yes', 'Print Shop', 'Flyers and promotional materials', '4752.26', ''],
    ['2024-02-02', 'New Student Special - Package Sale', 'Class Revenue', 'Packages', '225.00', '', 'Credit Card', 'No', 'Multiple New Students', '3 students × $75 intro packages', '4977.26', ''],
    ['2024-02-03', 'Equipment Maintenance', 'Variable Expenses', 'Maintenance', '', '80.00', 'Cash', 'Yes', 'Audio Tech Services', 'Sound system maintenance check', '4897.26', ''],
    ['2024-02-05', 'Valentine Partner Yoga Workshop', 'Class Revenue', 'Workshops', '480.00', '', 'Mixed Payments', 'No', 'Multiple Couples', '8 couples × $60 per couple', '5377.26', ''],
    ['2024-02-06', 'Liability Insurance', 'Fixed Expenses', 'Insurance', '', '125.00', 'Credit Card', 'Yes', 'Yoga Alliance Insurance', 'February coverage', '5252.26', ''],
    ['2024-02-07', 'Instructor Certification Reimbursement', 'Education', 'Professional Development', '', '300.00', 'Check', 'Yes', 'Alex Thompson', 'Continuing education support', '4952.26', ''],
    ['2024-02-08', 'Retail Sales - Multiple Items', 'Retail Revenue', 'Various', '85.00', '', 'Mixed Payments', 'No', 'Various Students', 'Water bottles, straps, blocks', '5037.26', ''],
    ['2024-02-10', 'Monthly Membership Growth', 'Class Revenue', 'Memberships', '360.00', '', 'Auto-pay', 'No', '3 New Members', 'Monthly unlimited subscriptions', '5397.26', ''],
    ['2024-02-12', 'Utilities February', 'Fixed Expenses', 'Utilities', '', '78.00', 'Bank Transfer', 'Yes', 'City Electric Company', 'February electricity - lower usage', '5319.26', ''],
    ['2024-02-14', 'Valentine Day Special Class', 'Class Revenue', 'Special Events', '200.00', '', 'Cash/Card Mix', 'No', 'Valentine Participants', 'Heart-opening themed class', '5519.26', ''],
    ['2024-02-15', 'Social Media Results', 'Marketing', 'Digital', '', '150.00', 'Credit Card', 'Yes', 'Facebook/Instagram', 'Increased ad spend - good ROI', '5369.26', ''],
    ['2024-02-20', 'Teacher Training Payment 2', 'Education Revenue', 'Training Programs', '800.00', '', 'Bank Transfer', 'No', 'Training Student', 'Month 2 of 200-hr certification', '6169.26', ''],
    ['2024-02-22', 'Corporate Expansion', 'Class Revenue', 'Corporate', '450.00', '', 'Check', 'No', 'StartupHub Co.', 'Added second corporate client', '6619.26', ''],
    ['2024-02-25', 'Props Restocking', 'Inventory', 'Props', '', '200.00', 'Credit Card', 'Yes', 'Yoga Outlet', 'Additional mats and blocks', '6419.26', ''],
    ['2024-02-28', 'February Summary', 'Administrative', 'Bookkeeping', '', '', 'N/A', 'No', 'Monthly Accounting', 'Revenue: $2,600 | Expenses: $2,283 | Net: +$317', '6419.26', '+317.00']
  ];
  
  const csvContent = [headers, ...sampleData]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
    
  return csvContent + '\n\n' + `
"FINANCIAL TRACKING INSTRUCTIONS"
""
"INCOME CATEGORIES:"
"- Class Revenue: Drop-ins, Packages, Memberships"
"- Workshop Revenue: Special events and workshops"  
"- Private Sessions: One-on-one instruction"
"- Corporate: Business/workplace classes"
"- Teacher Training: Certification programs"
"- Retail: Props, merchandise, books"
"- Other: Donations, grants, etc."
""
"EXPENSE CATEGORIES:"
"- Fixed Expenses: Rent, insurance, software subscriptions"
"- Variable Expenses: Instructor pay, supplies, processing fees"
"- Marketing: Advertising, promotional materials"
"- Equipment: Mats, props, sound system"
"- Education: Professional development, continuing education"
"- Legal/Admin: Licenses, accounting, legal fees"
"- Maintenance: Cleaning, repairs, utilities"
""
"TAX DEDUCTIBLE EXPENSES:"
"- Business equipment and supplies"
"- Professional development and education"
"- Marketing and advertising"
"- Business insurance and licenses"
"- Business-related travel"
"- Office supplies and software"
""
"MONTHLY REPORTING TIPS:"
"1. Reconcile with bank statements weekly"
"2. Track cash transactions immediately"
"3. Save all receipts and invoices"  
"4. Categorize expenses for tax preparation"
"5. Monitor profit margins by service type"
"6. Review trends monthly for business insights"
""
"KEY METRICS TO TRACK:"
"- Average revenue per student"
"- Cost per class acquisition"
"- Monthly recurring revenue (memberships)"
"- Instructor cost as % of revenue"
"- Monthly profit margin"
"- Student lifetime value"
`;
}

// Generate Class Feedback Survey HTML
export function generateFeedbackSurvey(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Class Feedback Survey</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            max-width: 700px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6; 
            background: #f8fafb;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 3px solid #667eea;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .header p {
            color: #718096;
            font-size: 16px;
        }
        .question { 
            margin-bottom: 25px; 
            padding: 20px; 
            background: #f7fafc; 
            border-radius: 8px; 
            border-left: 4px solid #667eea;
        }
        .question h3 { 
            margin-top: 0; 
            color: #2d3748; 
            font-size: 18px;
            margin-bottom: 15px;
        }
        .rating { 
            display: flex; 
            gap: 15px; 
            align-items: center; 
            flex-wrap: wrap;
            justify-content: center;
        }
        .rating label {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            padding: 10px;
            border-radius: 6px;
            transition: background-color 0.2s;
        }
        .rating label:hover {
            background-color: #e2e8f0;
        }
        .rating input[type="radio"] {
            margin-bottom: 5px;
            transform: scale(1.2);
        }
        .rating-labels {
            display: flex;
            justify-content: space-between;
            margin-top: 10px;
            font-size: 12px;
            color: #718096;
        }
        textarea, input[type="text"], input[type="email"] {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 6px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.2s;
        }
        textarea:focus, input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        textarea {
            height: 100px;
        }
        .checkbox-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
        }
        .checkbox-item {
            display: flex;
            align-items: center;
            padding: 8px;
            background: white;
            border-radius: 4px;
            border: 1px solid #e2e8f0;
        }
        .checkbox-item input {
            margin-right: 10px;
            transform: scale(1.1);
        }
        .submit-section {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
        }
        .submit-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        .submit-btn:hover {
            transform: translateY(-2px);
        }
        .thank-you {
            background: #f0fff4;
            border: 1px solid #9ae6b4;
            border-radius: 6px;
            padding: 15px;
            margin-top: 20px;
            text-align: center;
            color: #276749;
        }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .container { padding: 20px; }
            .rating { gap: 8px; }
            .checkbox-group { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧘‍♀️ Class Feedback Survey</h1>
            <p>Your feedback helps us create better experiences for our yoga community</p>
        </div>

        <form id="feedbackForm">
            <!-- Class Information -->
            <div class="question">
                <h3>📅 Class Information</h3>
                <label for="className">Class Name/Type:</label>
                <input type="text" id="className" name="className" placeholder="e.g., Vinyasa Flow, Hatha Basics, Yin Yoga">
                <br><br>
                <label for="instructorName">Instructor:</label>
                <input type="text" id="instructorName" name="instructorName" placeholder="Instructor's name">
                <br><br>
                <label for="classDate">Date:</label>
                <input type="date" id="classDate" name="classDate">
            </div>

            <!-- Overall Experience -->
            <div class="question">
                <h3>⭐ Overall Class Experience</h3>
                <p>How would you rate your overall experience in today's class?</p>
                <div class="rating">
                    <label><input type="radio" name="overall" value="5"> 😍<br>Excellent</label>
                    <label><input type="radio" name="overall" value="4"> 😊<br>Good</label>
                    <label><input type="radio" name="overall" value="3"> 😐<br>Okay</label>
                    <label><input type="radio" name="overall" value="2"> 😕<br>Poor</label>
                    <label><input type="radio" name="overall" value="1"> 😞<br>Very Poor</label>
                </div>
            </div>

            <!-- Instruction Quality -->
            <div class="question">
                <h3>👩‍🏫 Instruction Quality</h3>
                <p>How clear and helpful were the instructor's cues and demonstrations?</p>
                <div class="rating">
                    <label><input type="radio" name="instruction" value="5"> 5<br>Excellent</label>
                    <label><input type="radio" name="instruction" value="4"> 4<br>Good</label>
                    <label><input type="radio" name="instruction" value="3"> 3<br>Average</label>
                    <label><input type="radio" name="instruction" value="2"> 2<br>Poor</label>
                    <label><input type="radio" name="instruction" value="1"> 1<br>Very Poor</label>
                </div>
            </div>

            <!-- Class Pace -->
            <div class="question">
                <h3>⏰ Class Pace</h3>
                <p>How did you find the pace of today's class?</p>
                <div class="rating">
                    <label><input type="radio" name="pace" value="fast"> 🏃‍♀️<br>Too Fast</label>
                    <label><input type="radio" name="pace" value="slightly-fast"> ⚡<br>Slightly Fast</label>
                    <label><input type="radio" name="pace" value="perfect"> 👌<br>Just Right</label>
                    <label><input type="radio" name="pace" value="slightly-slow"> 🐌<br>Slightly Slow</label>
                    <label><input type="radio" name="pace" value="slow"> 🔄<br>Too Slow</label>
                </div>
            </div>

            <!-- Class Level -->
            <div class="question">
                <h3>📊 Difficulty Level</h3>
                <p>How appropriate was the class level for you?</p>
                <div class="rating">
                    <label><input type="radio" name="difficulty" value="too-easy"> 😴<br>Too Easy</label>
                    <label><input type="radio" name="difficulty" value="easy"> 🙂<br>Easy</label>
                    <label><input type="radio" name="difficulty" value="perfect"> 🎯<br>Perfect</label>
                    <label><input type="radio" name="difficulty" value="challenging"> 💪<br>Challenging</label>
                    <label><input type="radio" name="difficulty" value="too-hard"> 😰<br>Too Hard</label>
                </div>
            </div>

            <!-- What You Enjoyed -->
            <div class="question">
                <h3>💚 What You Enjoyed Most</h3>
                <p>What aspects of the class did you particularly enjoy? (Check all that apply)</p>
                <div class="checkbox-group">
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="sequence"> Sequence flow</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="music"> Music selection</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="adjustments"> Physical adjustments</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="breathing"> Breathing guidance</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="meditation"> Meditation/mindfulness</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="modifications"> Pose modifications</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="atmosphere"> Studio atmosphere</div>
                    <div class="checkbox-item"><input type="checkbox" name="enjoyed[]" value="community"> Class community feel</div>
                </div>
            </div>

            <!-- Improvements -->
            <div class="question">
                <h3>💡 Suggestions for Improvement</h3>
                <label for="improvements">What could we do to improve your class experience?</label>
                <textarea id="improvements" name="improvements" placeholder="Any suggestions for making the class even better..."></textarea>
            </div>

            <!-- Likelihood to Recommend -->
            <div class="question">
                <h3>📢 Recommendation</h3>
                <p>How likely are you to recommend this class to a friend?</p>
                <div class="rating">
                    <label><input type="radio" name="recommend" value="10"> 10<br>Definitely</label>
                    <label><input type="radio" name="recommend" value="9"> 9</label>
                    <label><input type="radio" name="recommend" value="8"> 8</label>
                    <label><input type="radio" name="recommend" value="7"> 7</label>
                    <label><input type="radio" name="recommend" value="6"> 6</label>
                    <label><input type="radio" name="recommend" value="5"> 5<br>Neutral</label>
                    <label><input type="radio" name="recommend" value="4"> 4</label>
                    <label><input type="radio" name="recommend" value="3"> 3</label>
                    <label><input type="radio" name="recommend" value="2"> 2</label>
                    <label><input type="radio" name="recommend" value="1"> 1</label>
                    <label><input type="radio" name="recommend" value="0"> 0<br>No way</label>
                </div>
                <div class="rating-labels">
                    <span>Not likely</span>
                    <span>Very likely</span>
                </div>
            </div>

            <!-- Additional Comments -->
            <div class="question">
                <h3>💬 Additional Comments</h3>
                <label for="comments">Anything else you'd like to share?</label>
                <textarea id="comments" name="comments" placeholder="Additional thoughts, special requests, or general feedback..."></textarea>
            </div>

            <!-- Contact Information (Optional) -->
            <div class="question">
                <h3>📧 Stay Connected (Optional)</h3>
                <label for="email">Email (for follow-up or class updates):</label>
                <input type="email" id="email" name="email" placeholder="your.email@example.com">
                <br><br>
                <label for="studentName">Name:</label>
                <input type="text" id="studentName" name="studentName" placeholder="Your name">
            </div>

            <div class="submit-section">
                <button type="submit" class="submit-btn">Submit Feedback</button>
                <div class="thank-you" style="display: none;" id="thankYouMessage">
                    <h3>🙏 Thank you for your feedback!</h3>
                    <p>Your input helps us continuously improve our classes and better serve our yoga community.</p>
                </div>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('feedbackForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Hide form and show thank you message
            this.style.display = 'none';
            document.getElementById('thankYouMessage').style.display = 'block';
            
            // Here you would typically send the form data to your server
            console.log('Feedback submitted');
        });
    </script>
</body>
</html>`;
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