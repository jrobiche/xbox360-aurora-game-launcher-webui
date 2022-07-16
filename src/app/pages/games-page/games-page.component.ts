import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CreditsDialogComponent } from '../../components/credits-dialog/credits-dialog.component';
import { Game } from '../../models/game';

enum AuroraContentGroup {
  Start = 0,
  Hidden = 0,
  Xbox360 = 1,
  XBLA = 2,
  Indie = 3,
  XboxClassic = 4,
  Unsigned = 5,
  LibXenon = 6,
  Count = 7,
}

enum CustomContentGroup {
  All = 0,
  Xbox360 = 1,
  Arcade = 2,
  Indie = 3,
  OGXbox = 4,
  Homebrew = 5,
}

interface ContentGroup {
  group: number;
  name: string;
}

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.scss'],
})
export class GamesPageComponent implements OnInit {
  contentGroup: ContentGroup;
  contentGroups: ContentGroup[];
  game: Game | null;
  gameListAll: Game[];
  gameListFiltered: Game[];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private _snackBar: MatSnackBar,
    private apiService: ApiService
  ) {
    this.contentGroups = [
      {
        group: CustomContentGroup.All,
        name: 'All',
      },
      {
        group: CustomContentGroup.Xbox360,
        name: 'Xbox 360',
      },
      {
        group: CustomContentGroup.Arcade,
        name: 'Arcade',
      },
      {
        group: CustomContentGroup.Indie,
        name: 'Indie',
      },
      {
        group: CustomContentGroup.OGXbox,
        name: 'OG Xbox',
      },
      {
        group: CustomContentGroup.Homebrew,
        name: 'Homebrew',
      },
    ];
    this.contentGroup = this.contentGroups[0];
    this.game = null;
    this.gameListAll = [];
    this.gameListFiltered = [];
  }

  ngOnInit(): void {
    if (this.apiService.isAuthenticated()) {
      this.getTitles();
      return;
    }

    if (this.apiService.autologin) {
      this.apiService.autoLogin();
      this.getTitles();
      return;
    }

    this.router.navigate(['/login']);
  }

  private getTitles(): void {
    this.apiService.getTitles().subscribe(
      (response: Array<Game>) => {
        // filter out hidden games
        let gameListAll = response.filter((game: Game) => {
          return !game.hidden;
        });

        // treat Unsigned, LibXenon, and Count as Homebrew
        gameListAll.forEach((game: Game) => {
          if (
            game.contentGroup == AuroraContentGroup.Unsigned ||
            game.contentGroup == AuroraContentGroup.LibXenon ||
            game.contentGroup == AuroraContentGroup.Count
          ) {
            game.contentGroup = CustomContentGroup.Homebrew;
          }
        });

        // sort by game title name
        gameListAll = gameListAll.sort(this.compareGameTitleNames);

        this.gameListAll = gameListAll;
        this.filterGamesByContentGroup();
      },
      (error: any) => {
        console.error('Failed to get game list:', error);
        this.openSnackBar('Failed to get game list', '', 4);
      }
    );
  }

  compareGameTitleNames(a: Game, b: Game): number {
    const nameA = a.titleName.toUpperCase();
    const nameB = b.titleName.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  filterGamesByContentGroup(): void {
    if (this.contentGroup.group == AuroraContentGroup.Start) {
      this.gameListFiltered = this.gameListAll;
    } else {
      this.gameListFiltered = this.gameListAll.filter((game: Game) => {
        return game.contentGroup == this.contentGroup.group;
      });
    }
  }

  launchTitle(game: Game) {
    this.apiService.titleLaunch(game).subscribe(
      (response: any) => {},
      (error: any) => {
        console.error('Error launching title:', error);
      }
    );
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreditsDialogComponent);
  }

  openSnackBar(message: string, action: string, duration: number): void {
    this._snackBar.open(message, action, {
      duration: duration * 1000,
    });
  }

  selectGame(e: any): void {
    if (e.options[0].selectionList._value !== null) {
      this.game = e.options[0].selectionList._value[0];
    }
  }

  setContentGroup(contentGroup: ContentGroup): void {
    this.contentGroup = contentGroup;
    this.filterGamesByContentGroup();
  }
}
