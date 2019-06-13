import { Component } from '@angular/core';

// const todos = []
// const todos = [
//   {
//     id: 1,
//     title: '吃饭',
//     done:false
//   },
//   {
//     id: 2,
//     title: '唱歌',
//     done:true
//   },  
//   {
//     id: 3,
//     title: '写代码',
//     done:true
//   },
// ];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]');
  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  }[] = null;
  
  public visibility: string = 'all';
  // 实现导航切换数据过滤的功能
  // 1. 提供一个属性,该属性根据当前点击的链接返回过滤后的数据
  // filterTodos
  // 2. 提供一个属性,用来存储当前点击的链接表示
  // visibility 字符串
  // all  active  completed
  // 3. 为链接添加点击事件,当点击导航链接的时候,改变
  get filterTodos() {
    if (this.visibility === 'all') {
      return this.todos;
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done);
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done);
   }
  }
  //  ngOnInit() : 该函数是一个特殊的 Angular 生命周期钩子函数
  // 它会在 Angular 应用初始化的时候执行一次
  ngOnInit() {
  //  当用户点击了锚点的时候,我们需要获取到当前的锚点标识
    // 然后动态的将跟组件中的 visibility 设置为当前点击的锚点标识
    this.hashChange();
    // 注意:这里要 bind this绑定 改变this指向
    window.onhashchange = this.hashChange.bind(this);
 }
 ngDoCheck() {
  //  当Angular 组件数据发生改变的时候,ngDoCheck 钩子函数会被触发
  //  我们要做的就是在这个钩子函数中去持久化存储我们的todos数据
   window.localStorage.setItem('todos',JSON.stringify(this.todos))
 }
  add(e): void {
    const titleText = e.target.value;
    if (!titleText.length) {
      return;
    }
    let last = this.todos[this.todos.length - 1];
    this.todos.push({
      id: last ? last.id + 1 : 1,
      title: titleText,
      done: false
    });
    e.target.value = '';
  }

  get toggleAll() {
    return this.todos.every(t => t.done);
  }
  set toggleAll(val) {
    this.todos.forEach(t => t.done = val);
  }

  remove(index : number) {
    this.todos.splice(index, 1);
  }

  saveEdit(todo, e) {
    // 保存编辑后的值
    todo.title = e.target.value;
    // 取消编辑样式
    this.currentEditing = null;
  }

  // esc键 取消编辑
  handlEditKeyup(e) {
    const { keyCode , target} = e;
    if (keyCode === 27) {
      // 取消编辑
      // 同时恢复为原来的值
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }

  // 获取没完成的数量
  get remaningCount() {
    return this.todos.filter(t => !t.done).length;
  }

  clearAllDone() {
    this.todos = this.todos.filter(t => !t.done);
  }

  hashChange() {
    const hash = window.location.hash.substr(1);
    switch (hash) {
      case '/':
        this.visibility = 'all';
        break;
      case '/active':
        this.visibility = 'active';
        break;
      case '/completed':
        this.visibility = 'completed';
        break;
    }
  }
}
