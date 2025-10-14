(function () {
  const isMobile = {
    Android: () => navigator.userAgent.match(/Android/i),
    BlackBerry: () => navigator.userAgent.match(/BlackBerry/i),
    iOS: () => navigator.userAgent.match(/iPhone|iPad|iPod/i),
    Opera: () => navigator.userAgent.match(/Opera Mini/i),
    Windows: () => navigator.userAgent.match(/IEMobile/i),
    any: function () {
      return (
        this.Android() ||
        this.BlackBerry() ||
        this.iOS() ||
        this.Opera() ||
        this.Windows()
      );
    },
  };

  if (isMobile.any() || window.innerWidth <= 768) {
    alert(
      "This website is not accessible from mobile devices. Please use a desktop computer."
    );
    window.location.href = "https://evenzero.in";
  }
})();
