import {IAuthService, IChangePasswordParams} from "../authentication/auth_service"
import {MessageBox} from "../helpers/message_box"


class UserProfileCtrl {
	isLoading: boolean;
	resetObj: any;
	
	static $inject = ["$state", "AuthService"];
	
	constructor(private $state: angular.ui.IStateService,
		private authService: IAuthService) { }
	
	changePassword(params: IChangePasswordParams){
		this.isLoading = true
		this.authService.changePassword(params).then((res) => {
			this.isLoading = false
			MessageBox.display(res.message, res.success)
		})
	}

	resetPassword(){
		this.isLoading = true
		//console.log(this.resetObj)
		if(!this.resetObj.userName){
			MessageBox.display("Please enter a valid username", false)
			return;
		}
		if(!this.resetObj.newPassword){
			MessageBox.display("Please enter a valid password", false)
			return;
		}
		if(this.resetObj.newPassword != this.resetObj.confirmPassword){
			MessageBox.display("Please make sure that the new and confirm passwords are the same", false)
			return;
		}
		this.authService.resetPassword(this.resetObj).then((res) => {
			this.isLoading = false;
			if(res.success) this.resetObj = {};
		})
	}
}

export {UserProfileCtrl}