const formatPhoto = (photo: string): string => {
	if (!photo){
		return "";
	}
	var oReutrn = "data:image/png;base64," + photo.substring(104)
	return oReutrn;
}
export default {
	formatPhoto
}