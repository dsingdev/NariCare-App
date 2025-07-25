import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChatbotService } from '../../services/chatbot.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  user: User | null = null;
  quickActions = [
    {
      title: 'Ask AI Assistant',
      description: 'Get instant help with breastfeeding questions',
      icon: 'chatbot',
      action: 'openChatbot',
      color: 'primary'
    },
    {
      title: 'Track Growth',
      description: 'Log your baby\'s latest measurements',
      icon: 'trending-up',
      action: 'trackGrowth',
      color: 'success'
    },
    {
      title: 'Browse Articles',
      description: 'Explore our knowledge base',
      icon: 'library',
      action: 'browseKnowledge',
      color: 'tertiary'
    },
    {
      title: 'Join Chat',
      description: 'Connect with other mothers',
      icon: 'chatbubbles',
      action: 'joinChat',
      color: 'secondary'
    }
  ];

  upcomingReminders = [
    {
      title: 'Growth Check-up',
      time: 'Tomorrow at 2:00 PM',
      type: 'growth'
    },
    {
      title: 'Expert Consultation',
      time: 'Friday at 10:00 AM',
      type: 'consultation'
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private chatbotService: ChatbotService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }

  handleQuickAction(action: string) {
    switch (action) {
      case 'openChatbot':
        this.openChatbot();
        break;
      case 'trackGrowth':
        this.router.navigate(['/tabs/growth']);
        break;
      case 'browseKnowledge':
        this.router.navigate(['/tabs/knowledge']);
        break;
      case 'joinChat':
        this.router.navigate(['/tabs/chat']);
        break;
    }
  }

  openChatbot() {
    // Initialize chatbot and navigate to chat
    if (this.user) {
      const babyAge = this.user.babies.length > 0 ? 
        this.calculateBabyAge(this.user.babies[0].dateOfBirth) : undefined;
      this.chatbotService.initializeChat(this.user.uid, babyAge);
    }
    this.router.navigate(['/tabs/chat'], { queryParams: { tab: 'ai' } });
  }

  private calculateBabyAge(birthDate: Date): number {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birthDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    const firstName = this.user?.firstName || 'there';
    
    if (hour < 12) return `Good morning, ${firstName}!`;
    if (hour < 17) return `Good afternoon, ${firstName}!`;
    return `Good evening, ${firstName}!`;
  }

  getTierDisplay(): string {
    if (!this.user?.tier) return 'Basic';
    
    switch (this.user.tier.type) {
      case 'one-month': return '1-Month Program';
      case 'three-month': return '3-Month Program';
      default: return 'Basic';
    }
  }

  navigateToProfile() {
    this.router.navigate(['/tabs/profile']);
  }
}