import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast, ToastService } from '../../core/services/toast.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="toast-container">
            <div *ngFor="let toast of toasts" 
                 class="toast" 
                 [class.toast-success]="toast.type === 'success'"
                 [class.toast-error]="toast.type === 'error'"
                 [class.toast-info]="toast.type === 'info'"
                 [class.toast-warning]="toast.type === 'warning'"
                 (click)="removeToast(toast.id)">
                <div class="toast-icon">
                    <i *ngIf="toast.type === 'success'" class="fas fa-check-circle"></i>
                    <i *ngIf="toast.type === 'error'" class="fas fa-exclamation-circle"></i>
                    <i *ngIf="toast.type === 'info'" class="fas fa-info-circle"></i>
                    <i *ngIf="toast.type === 'warning'" class="fas fa-exclamation-triangle"></i>
                </div>
                <div class="toast-message">{{ toast.message }}</div>
                <button class="toast-close" (click)="removeToast(toast.id); $event.stopPropagation()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `,
    styles: [`
        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .toast {
            min-width: 300px;
            max-width: 400px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            animation: slideIn 0.3s ease-out;
            transition: all 0.2s ease;
        }

        .toast:hover {
            transform: translateX(-5px);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .toast-success {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
        }

        .toast-error {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
        }

        .toast-info {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
        }

        .toast-warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
        }

        .toast-icon {
            font-size: 20px;
            flex-shrink: 0;
        }

        .toast-message {
            flex: 1;
            font-weight: 500;
        }

        .toast-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            opacity: 0.8;
            transition: opacity 0.2s;
            flex-shrink: 0;
        }

        .toast-close:hover {
            opacity: 1;
        }
    `]
})
export class ToastComponent implements OnInit, OnDestroy {
    toasts: Toast[] = [];
    private subscription?: Subscription;
    private timers: Map<number, any> = new Map();

    constructor(private toastService: ToastService) { }

    ngOnInit() {
        this.subscription = this.toastService.toast$.subscribe(toast => {
            this.toasts.push(toast);

            // Auto-remove after duration
            const timer = setTimeout(() => {
                this.removeToast(toast.id);
            }, toast.duration);

            this.timers.set(toast.id, timer);
        });
    }

    removeToast(id: number) {
        const timer = this.timers.get(id);
        if (timer) {
            clearTimeout(timer);
            this.timers.delete(id);
        }
        this.toasts = this.toasts.filter(t => t.id !== id);
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
        this.timers.forEach(timer => clearTimeout(timer));
        this.timers.clear();
    }
}
