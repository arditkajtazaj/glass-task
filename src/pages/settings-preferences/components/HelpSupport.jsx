import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const faqCategories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: 'Play',
      faqs: [
        {
          id: 1,
          question: 'How do I create my first task?',
          answer: `To create your first task:\n\n1. Click the "+" button in the top navigation bar\n2. Enter your task title and description\n3. Set priority level and due date (optional)\n4. Click "Save" to create the task\n\nYou can also use the quick add shortcut Ctrl+N to open the task creation dialog instantly.`
        },
        {
          id: 2,
          question: 'How do I organize tasks with categories?',
          answer: `GlassTask supports flexible task organization:\n\n• Use tags to categorize tasks (work, personal, urgent)\n• Create custom categories in Settings > Productivity\n• Filter tasks by category using the search panel\n• Color-code categories for visual organization\n\nCategories help you maintain focus and quickly find related tasks.`
        },
        {
          id: 3,
          question: 'What are the different priority levels?',
          answer: `GlassTask offers four priority levels:\n\n• Low (Green): Non-urgent tasks, nice-to-have items\n• Medium (Blue): Standard tasks with moderate importance\n• High (Orange): Important tasks requiring attention\n• Urgent (Red): Critical tasks needing immediate action\n\nPriority levels help you focus on what matters most and organize your workflow effectively.`
        }
      ]
    },
    {
      id: 'features',
      name: 'Features & Functionality',
      icon: 'Zap',
      faqs: [
        {
          id: 4,
          question: 'How do keyboard shortcuts work?',
          answer: `GlassTask includes powerful keyboard shortcuts:\n\n• Ctrl+N: Quick add new task\n• Ctrl+F: Search tasks\n• Space: Complete selected task\n• Enter: Edit selected task\n• Delete: Remove selected task\n\nYou can customize all shortcuts in Settings > Keyboard Shortcuts. Enable "Show shortcut hints" to see shortcuts in tooltips.`
        },
        {
          id: 5,
          question: 'Can I export my tasks?',
          answer: `Yes! GlassTask supports multiple export formats:\n\n• JSON: Complete data with all metadata\n• CSV: Spreadsheet-compatible format\n• TXT: Simple text format\n• PDF: Printable document format\n\nGo to Settings > Data Management > Export Data to download your tasks. You can also set up automatic backups for peace of mind.`
        },
        {
          id: 6,
          question: 'How do I set up reminders?',
          answer: `Set up reminders to never miss important tasks:\n\n1. Edit any task and set a due date\n2. Choose reminder timing (5 min to 1 day before)\n3. Enable desktop notifications in Settings\n4. Configure email reminders for overdue tasks\n\nSmart reminders use AI to suggest optimal reminder times based on your usage patterns.`
        }
      ]
    },
    {
      id: 'customization',
      name: 'Customization',
      icon: 'Palette',
      faqs: [
        {
          id: 7,
          question: 'How do I change the theme?',
          answer: `Customize GlassTask's appearance:\n\n1. Go to Settings > Appearance\n2. Choose from Light, Dark, or System theme\n3. Select your preferred color scheme\n4. Adjust glass effect intensity\n5. Enable high contrast mode if needed\n\nAll changes apply instantly with smooth transitions. Your preferences are saved automatically.`
        },
        {
          id: 8,
          question: 'Can I create custom task templates?',
          answer: `Yes! Create templates for recurring task types:\n\n1. Go to Settings > Productivity > Task Templates\n2. Choose from pre-built templates (Meeting, Project, Personal)\n3. Create custom templates with placeholders\n4. Use [brackets] for dynamic content\n\nTemplates save time and ensure consistency across similar tasks.`
        }
      ]
    },
    {
      id: 'troubleshooting',name: 'Troubleshooting',icon: 'AlertCircle',
      faqs: [
        {
          id: 9,
          question: 'Tasks are not saving properly',answer: `If tasks aren't saving:\n\n1. Check your internet connection\n2. Clear browser cache and cookies\n3. Disable browser extensions temporarily\n4. Try using incognito/private mode\n5. Check if local storage is enabled\n\nIf issues persist, export your data as backup and contact support with your browser details.`
        },
        {
          id: 10,
          question: 'Notifications are not working',
          answer: `To fix notification issues:\n\n1. Enable browser notifications when prompted\n2. Check Settings > Productivity > Notifications\n3. Ensure "Desktop notifications" is enabled\n4. Check your browser's notification settings\n5. Verify the app isn't muted in system settings\n\nFor mobile devices, add GlassTask to your home screen for better notification support.`
        },
        {
          id: 11,
          question: 'App is running slowly',
          answer: `To improve performance:\n\n1. Reduce glass effect intensity in Settings > Appearance\n2. Enable "Reduce motion effects" for better performance\n3. Clear completed tasks regularly\n4. Limit the number of tasks displayed at once\n5. Close other browser tabs to free up memory\n\nConsider using a modern browser like Chrome, Firefox, or Safari for optimal performance.`
        }
      ]
    }
  ];

  const quickLinks = [
    { name: 'User Guide', icon: 'BookOpen', url: '#', description: 'Complete documentation and tutorials' },
    { name: 'Video Tutorials', icon: 'Play', url: '#', description: 'Step-by-step video guides' },
    { name: 'Keyboard Shortcuts', icon: 'Keyboard', url: '#', description: 'Complete list of shortcuts' },
    { name: 'What\'s New', icon: 'Sparkles', url: '#', description: 'Latest features and updates' },
    { name: 'Community Forum', icon: 'Users', url: '#', description: 'Connect with other users' },
    { name: 'Feature Requests', icon: 'Lightbulb', url: '#', description: 'Suggest new features' }
  ];

  const contactCategories = [
    { value: 'general', label: 'General Question' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'account', label: 'Account Issue' },
    { value: 'billing', label: 'Billing Question' },
    { value: 'other', label: 'Other' }
  ];

  const filteredFaqs = faqCategories?.map(category => ({
    ...category,
    faqs: category?.faqs?.filter(faq =>
      searchQuery === '' ||
      faq?.question?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      faq?.answer?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  }))?.filter(category => category?.faqs?.length > 0);

  const handleContactSubmit = (e) => {
    e?.preventDefault();
    console.log('Contact form submitted:', contactForm);
    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary glass-light flex items-center justify-center">
            <Icon name="HelpCircle" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Help & Support</h3>
            <p className="text-sm text-muted-foreground">Find answers and get assistance</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>
      {/* Quick Links */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <h4 className="text-lg font-semibold text-foreground mb-4">Quick Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks?.map((link) => (
            <a
              key={link?.name}
              href={link?.url}
              className="flex items-start space-x-3 p-4 glass-light rounded-lg hover-lift press-scale transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Icon name={link?.icon} size={16} className="text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {link?.name}
                </h5>
                <p className="text-sm text-muted-foreground mt-1">{link?.description}</p>
              </div>
              <Icon name="ExternalLink" size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </div>
      {/* FAQ Section */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <h4 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h4>
        
        {filteredFaqs?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium">No results found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredFaqs?.map((category) => (
              <div key={category?.id}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                    <Icon name={category?.icon} size={14} className="text-primary-foreground" />
                  </div>
                  <h5 className="font-semibold text-foreground">{category?.name}</h5>
                </div>
                
                <div className="space-y-3">
                  {category?.faqs?.map((faq) => (
                    <div key={faq?.id} className="glass-light rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSelectedFaq(selectedFaq === faq?.id ? null : faq?.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors duration-200"
                      >
                        <span className="font-medium text-foreground pr-4">{faq?.question}</span>
                        <Icon 
                          name={selectedFaq === faq?.id ? "ChevronUp" : "ChevronDown"} 
                          size={20} 
                          className="text-muted-foreground flex-shrink-0" 
                        />
                      </button>
                      {selectedFaq === faq?.id && (
                        <div className="px-4 pb-4 border-t border-border/30">
                          <div className="pt-4 text-sm text-muted-foreground whitespace-pre-line">
                            {faq?.answer}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Contact Support */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent glass-light flex items-center justify-center">
            <Icon name="MessageCircle" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">Contact Support</h4>
            <p className="text-sm text-muted-foreground">Can't find what you're looking for? We're here to help!</p>
          </div>
        </div>

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              type="text"
              required
              value={contactForm?.name}
              onChange={(e) => setContactForm({...contactForm, name: e?.target?.value})}
              placeholder="Your full name"
            />
            <Input
              label="Email"
              type="email"
              required
              value={contactForm?.email}
              onChange={(e) => setContactForm({...contactForm, email: e?.target?.value})}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select
                value={contactForm?.category}
                onChange={(e) => setContactForm({...contactForm, category: e?.target?.value})}
                className="w-full px-3 py-2 bg-muted/50 border border-border/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                {contactCategories?.map((cat) => (
                  <option key={cat?.value} value={cat?.value}>{cat?.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Subject"
              type="text"
              required
              value={contactForm?.subject}
              onChange={(e) => setContactForm({...contactForm, subject: e?.target?.value})}
              placeholder="Brief description of your issue"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Message</label>
            <textarea
              required
              rows={5}
              value={contactForm?.message}
              onChange={(e) => setContactForm({...contactForm, message: e?.target?.value})}
              placeholder="Please describe your issue or question in detail..."
              className="w-full px-3 py-2 bg-muted/50 border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-vertical"
            />
          </div>

          <Button
            type="submit"
            variant="default"
            iconName="Send"
            iconPosition="left"
            className="w-full md:w-auto"
          >
            Send Message
          </Button>
        </form>

        <div className="mt-6 p-4 bg-success/10 border border-success/30 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={20} className="text-success flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-success font-medium mb-1">Response Time</p>
              <p className="text-muted-foreground">
                We typically respond within 24 hours during business days. For urgent issues, 
                please include "URGENT" in your subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* System Information */}
      <div className="glass rounded-xl p-6 hover-lift transition-all duration-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-warning to-error glass-light flex items-center justify-center">
            <Icon name="Info" size={20} className="text-primary-foreground" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">System Information</h4>
            <p className="text-sm text-muted-foreground">Helpful details for troubleshooting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">App Version:</span>
              <span className="text-foreground font-mono">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Browser:</span>
              <span className="text-foreground font-mono">{navigator.userAgent?.split(' ')?.[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform:</span>
              <span className="text-foreground font-mono">{navigator.platform}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Screen Resolution:</span>
              <span className="text-foreground font-mono">{screen.width}×{screen.height}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone:</span>
              <span className="text-foreground font-mono">{Intl.DateTimeFormat()?.resolvedOptions()?.timeZone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Language:</span>
              <span className="text-foreground font-mono">{navigator.language}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;