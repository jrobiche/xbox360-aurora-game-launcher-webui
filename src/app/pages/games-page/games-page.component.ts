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
  homeTitle: Game | null;

  constructor(
    public dialog: MatDialog,
    private _apiService: ApiService,
    private _router: Router,
    private _snackBar: MatSnackBar
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
        group: CustomContentGroup.Homebrew,
        name: 'Homebrew',
      },
      {
        group: CustomContentGroup.OGXbox,
        name: 'OG Xbox',
      },
    ];
    this.contentGroup = this.contentGroups[0];
    this.game = null;
    this.gameListAll = [];
    this.gameListFiltered = [];
    this.homeTitle = null;
  }

  ngOnInit(): void {
    // get plugin information and redirect to /login if unauthorized
    this._apiService.getPlugin().subscribe(
      (response: any) => {
        let pathSplitIndex = response.path.launcher.lastIndexOf('\\');
        let directory = response.path.launcher.substr(0, pathSplitIndex);
        let executable = response.path.launcher.substr(pathSplitIndex + 1);
        let executableType = 2; // xbox 360 container
        if (executable.endsWith('.xex')) {
          executableType = 0; // xbox 360 executable
        }
        this.homeTitle = {
          art: {
            background: '',
            banner: '',
            boxartLarge: '',
            boxartSmall: '',
            screenshots: [],
            tile: '',
          },
          contentGroup: 5,
          directory: directory,
          executable: executable,
          fileUrls: [],
          hidden: false,
          titleName: 'Aurora',
          type: 0,
        };
      },
      (error: any) => {
        if (error.status == 401) {
          this._router.navigate(['/login']);
        } else {
          console.error(
            'Failed to get plugin information. Got the following error:',
            error
          );
          this._snackBar.open('Failed to get plugin information', 'CLOSE', {
            duration: 5000,
          });
        }
      }
    );

    // get list of titles
    this._apiService.getTitles().subscribe(
      (response: Array<Game>) => {
        // filter out hidden games
        let gameList = response.filter((game: Game) => {
          return !game.hidden;
        });
        // treat Unsigned, LibXenon, and Count as Homebrew
        gameList.forEach((game: Game) => {
          if (
            game.contentGroup == AuroraContentGroup.Unsigned ||
            game.contentGroup == AuroraContentGroup.LibXenon ||
            game.contentGroup == AuroraContentGroup.Count
          ) {
            game.contentGroup = CustomContentGroup.Homebrew;
          }
        });
        // sort by game title name
        gameList = gameList.sort(this.compareGameTitleNames);
        this.gameListAll = gameList;
        this.filterGamesByContentGroup();
      },
      (error: any) => {
        if (error.status == 401) {
          this._router.navigate(['/login']);
        } else {
          console.error(
            'Failed to get game list. Got the following error:',
            error
          );
          this._snackBar.open('Failed to get game list', 'CLOSE', {
            duration: 5000,
          });
        }
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
    this._apiService.launchTitle(game).subscribe(
      (response: any) => {
        return;
      },
      (error: any) => {
        if (error.status == 401) {
          this._router.navigate(['/login']);
        } else {
          console.error(
            'Failed to launch title. Got the following error:',
            error
          );
          this._snackBar.open('Failed to launch title', 'CLOSE', {
            duration: 5000,
          });
        }
      }
    );
  }

  openCreditsDialog(): void {
    const dialogRef = this.dialog.open(CreditsDialogComponent);
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
