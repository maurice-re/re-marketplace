export class FormButtonModel {
  title: string;
  route: string;
  image?: string;
  icon?: boolean;

  constructor(title: string, route: string, image?: string, icon?: boolean) {
    this.title = title;
    this.route = route;
    this.image = image;
    this.icon = icon;
  }
}
