import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaDeChatComponent } from './sala-de-chat.component';

describe('SalaDeChatComponent', () => {
  let component: SalaDeChatComponent;
  let fixture: ComponentFixture<SalaDeChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaDeChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaDeChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
