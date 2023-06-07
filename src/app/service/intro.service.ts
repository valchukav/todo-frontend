import {Injectable} from '@angular/core';
import introJs from 'intro.js';

@Injectable({
  providedIn: 'root'
})
export class IntroService {

  private static INTRO_VIEWED_KEY = 'intro-viewed';
  private static INTRO_VIEWED_VALUE = 'done';

  constructor() {
  }

  public startIntroJS(checkViewed: boolean) {
    if (checkViewed === true
      && localStorage.getItem(IntroService.INTRO_VIEWED_KEY) === IntroService.INTRO_VIEWED_VALUE) {
      return;
    }

    const intro = introJs();

    intro.setOptions(
      {
        nextLabel: 'след. >',
        prevLabel: '< пред.',
        doneLabel: 'Выход',
        scrollToElement: true,
        // skipLabel: 'Выход',
        exitOnEsc: true,
        exitOnOverlayClick: false,
        tooltipClass: 'customTooltip'
      }
    );

    intro.addSteps([
        {
          element: document.getElementById('root-categories'),
          intro: 'Фильтрация задач, добавление/удаление/редактирование категорий',
          position: 'right'
        },
        {
          element: document.getElementById('stats-and-tasks'),
          intro: 'Список всех задач со статистикой'
        },
        {
          element: document.getElementById('add-task-button'),
          intro: 'Добавление новой задачи',
          position: "left"
        },
        {
          element: document.getElementById('edit-priorities-settings'),
          intro: 'Добавление/удаление/редактирование приоритетов',
          position: "left"
        }
      ]
    );

    intro.start();

    intro.onexit(
      (_: any) => localStorage.setItem(IntroService.INTRO_VIEWED_KEY, IntroService.INTRO_VIEWED_VALUE)
    );
  }
}
