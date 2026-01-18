import { FlatIcon, FlatIconName } from '../components/FlatIcon';
import { PATHS } from '../constants/paths';
import { navigateHard } from '../utils/routes/helpers';

const OnboardingPage = async (): Promise<HTMLElement> => {
  const pageDiv = document.createElement('div');
  const containerDiv = document.createElement('div');
  const logoDiv = document.createElement('div');

  pageDiv.classList.add('onboarding-page');
  containerDiv.classList.add('onboarding-page__container');
  logoDiv.classList.add('onboarding-page__logo');

  let currentStep = 0;

  const steps: string[] = [
    'Welcome to Writtte, the space where long documents come alive and everything you write lives in one place.',
    'Write, copy, and share anywhere, Medium, Substack, your blog, without extra formatting, steps or headaches.',
    "Unlike Google Docs or Notion, there's no clutter, no distractions. Just you and your words, flowing fast and smooth.",
    'Every tool you need to write great documents is right here.',
    'Enough waiting. Start your first document now and see your ideas take shape instantly.',
  ];

  const stepElements: HTMLElement[] = [];
  const dotElements: HTMLElement[] = [];

  const updateProgressDots = (index: number): void => {
    dotElements.forEach((dot, i) => {
      dot.classList.remove('onboarding-page__progress-dot--active');
      dot.classList.remove('onboarding-page__progress-dot--current');

      if (i < index) {
        dot.classList.add('onboarding-page__progress-dot--active');
      } else if (i === index) {
        dot.classList.add('onboarding-page__progress-dot--active');
        dot.classList.add('onboarding-page__progress-dot--current');
      }
    });
  };

  const showStep = (index: number): void => {
    currentStep = index;

    stepElements.forEach((step, i) => {
      if (i === index) {
        step.classList.add('onboarding-page__step--active');
        step.classList.remove('onboarding-page__step--hidden');
        step.classList.remove('onboarding-page__step--exit');
      } else if (i < index) {
        step.classList.remove('onboarding-page__step--active');
        step.classList.remove('onboarding-page__step--hidden');
        step.classList.add('onboarding-page__step--exit');
      } else {
        step.classList.remove('onboarding-page__step--active');
        step.classList.remove('onboarding-page__step--exit');
        step.classList.add('onboarding-page__step--hidden');
      }
    });

    updateProgressDots(index);
  };

  const goToStep = (index: number): void => {
    if (index >= 0 && index < steps.length) {
      showStep(index);
    }
  };

  const goToNextStep = (): void => {
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
    } else {
      containerDiv.classList.add('onboarding-page__container--complete');
      progressDiv.classList.add('onboarding-page__progress--complete');

      setTimeout(() => {
        navigateHard(PATHS.DOCUMENTS);
      }, 600);
    }
  };

  for (let i = 0; i < steps.length; i++) {
    const stepDiv = document.createElement('div');
    const textSpan = document.createElement('span');
    const buttonSpan = document.createElement('span');

    stepDiv.classList.add('onboarding-page__step');

    if (i === steps.length - 1) {
      stepDiv.classList.add('onboarding-page__step--final');
    }

    if (i === 0) {
      stepDiv.classList.add('onboarding-page__step--active');
    } else {
      stepDiv.classList.add('onboarding-page__step--hidden');
    }

    textSpan.classList.add('onboarding-page__step-text');
    buttonSpan.classList.add('onboarding-page__step-button');

    if (i === steps.length - 1) {
      buttonSpan.classList.add('onboarding-page__step-button--start');

      const startText = document.createElement('span');
      startText.classList.add('onboarding-page__step-button-text');
      startText.textContent = 'Start Writing';
      buttonSpan.appendChild(startText);
    }

    buttonSpan.appendChild(FlatIcon(FlatIconName._18_ARROW_RIGHT));
    buttonSpan.addEventListener('click', goToNextStep);

    stepDiv.append(textSpan, buttonSpan);
    textSpan.textContent = steps[i];

    stepElements.push(stepDiv);
    containerDiv.appendChild(stepDiv);
  }

  const progressDiv = document.createElement('div');
  progressDiv.classList.add('onboarding-page__progress');

  for (let i = 0; i < steps.length; i++) {
    const dot = document.createElement('span');
    dot.classList.add('onboarding-page__progress-dot');

    if (i === 0) {
      dot.classList.add('onboarding-page__progress-dot--active');
      dot.classList.add('onboarding-page__progress-dot--current');
    }

    dot.addEventListener('click', () => {
      goToStep(i);
    });

    dotElements.push(dot);
    progressDiv.appendChild(dot);
  }

  logoDiv.appendChild(FlatIcon(FlatIconName._26_WRITTTE_LOGO));
  pageDiv.append(logoDiv, containerDiv);
  pageDiv.appendChild(progressDiv);

  return pageDiv;
};

export { OnboardingPage };
