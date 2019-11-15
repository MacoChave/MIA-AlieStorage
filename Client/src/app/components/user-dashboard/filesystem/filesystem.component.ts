import { Component, OnInit, HostBinding } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { FilesystemService } from 'src/app/service/filesystem.service';
import { Disk } from 'src/app/modules/Disk';
import { User } from 'src/app/modules/User';

@Component({
  selector: 'app-filesystem',
  templateUrl: './filesystem.component.html',
  styleUrls: ['./filesystem.component.css']
})
export class FilesystemComponent implements OnInit {

  @HostBinding('class') clases = 'filesystem';
  opened: boolean = false;
  toggle_button = 'arrow_forward';
  
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0, 
      name: node.name, 
      level: level
    }
  }
  
  treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable)
  treeFlattener = new MatTreeFlattener(this._transformer, node => node.level, node => node.expandable, node => node.children)
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener)

  disks: Disk[];
  user: User = {};

  constructor(private fs: FilesystemService) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('session'));
    this.fs.getDisk(this.user.COD_USUARIO.toString()).subscribe(
      res => {
        this.disks = res;
        console.info(this.disks);
      }
    )
  }

  toggle_menu() {
    this.opened = !this.opened;
    this.toggle_button = (this.opened) ? 'close' : 'arrow_forward';
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}


/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [
      {name: 'Apple'},
      {name: 'Banana'},
      {name: 'Fruit loops'},
    ]
  }, {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [
          {name: 'Broccoli'},
          {name: 'Brussel sprouts'},
        ]
      }, {
        name: 'Orange',
        children: [
          {name: 'Pumpkins'},
          {name: 'Carrots'},
        ]
      },
    ]
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}
