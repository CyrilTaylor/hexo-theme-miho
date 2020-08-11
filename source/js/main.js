(function (w, d) {
    var body = $('body, html'),
        toc = $("#post-toc"),
        headerMenu = $("#header-menu"),
        backTop = $("#sidebar-top"),
        search = $('#sidebar-search'),
        searchWrap = $('.search-wrap'),
        tags = $("#sidebar-menu-box-tags"),
        mobileTags = $("#mobile-header-container-tags"),
        categories = $("#sidebar-menu-box-categories"),
        sideMenuBox = $("#sidebar-menu-box"),
        mobileHeaderMenu = $("#mobile-header-menu-nav"),
        _mobileHeaderMenuLocked = false,
        sideMenuBoxIsOpen = false,
        lastAnchor = 0,
        clientHeight = d.documentElement.clientHeight; //获取可视区的高度
    var Blog = {
        showHeaderMenu: function (scrollTop) {
            if (scrollTop > clientHeight * 0.1) {
                headerMenu.removeClass("slide-down");
                headerMenu.addClass("slide-up");
            } else {
                headerMenu.removeClass("slide-up");
                headerMenu.addClass("slide-down");
            }
        },
        showBackTop: function (scrollTop) {
            backTop.css('display', (scrollTop > clientHeight) ? "block" : "none");
        },
        setTags: function (tags) {
            var labels = tags.find("a");
            labels.css({"font-size" : "15px"});
            for(var i = 0, len = labels.length; i < len; i++){
                var num = labels.eq(i).html().length % 5 +1;
                labels[i].className = "";
                labels.eq(i).addClass("color"+num);
            }
        },
        setCategories: function () {
            var labels = categories.find("a");
            labels.css({"font-size" : "15px"});
            for(var i = 0, len = labels.length; i < len; i++){
                var num = labels.eq(i).html().length % 5 +1;
                labels[i].className = "";
                labels.eq(i).addClass("color"+num);
            }
        },
        showSidebarBox: function (status) {
            if (status) {
                sideMenuBox.animate({
                    height:'162px',
                    opacity:'1'
                }, 300);
            } else {
                sideMenuBox.animate({
                    height:'0px',
                    opacity:'0'
                }, 300);
            }
        },
        showToc: function (scrollTop) {
            if (scrollTop / clientHeight >= 0.4) {
                toc.removeClass("post-toc-top");
                toc.addClass("post-toc-not-top");
            } else {
                toc.removeClass("post-toc-not-top");
                toc.addClass("post-toc-top");
            }
            var anchorList = $(".markdownIt-Anchor");
            var tocsList = $(".post-toc-link");
            var currentAnchor = lastAnchor;
            var offset = 0;
            var tocsHeight = tocsList[tocsList.length - 1].getBoundingClientRect().y
                             - tocsList[0].getBoundingClientRect().y;
            for (i = 1; i < anchorList.length; i++) {
                if(anchorList[i].getBoundingClientRect().y > clientHeight) {
                    currentAnchor = i - 1;
                    break;
                }
                if(i == anchorList.length - 1) {
                    currentAnchor = i;
                    offset += tocsList[i].offsetHeight;
                    break;
                }
                offset += tocsList[i].offsetHeight;
            }
            if(currentAnchor == lastAnchor) return;
            $(tocsList[lastAnchor]).removeClass("active");
            offset = offset < tocsHeight - clientHeight * 0.236 ? offset : tocsHeight - clientHeight * 0.236;
            toc[0].style.top = (clientHeight * 0.382 - offset) + "px";
            lastAnchor = currentAnchor;
            $(tocsList[currentAnchor]).addClass("active");
        },
        showMobileHeaderMenu: function (status) {
            if (_mobileHeaderMenuLocked) {
                return false;
            }
            if (status) {
                mobileHeaderMenu.addClass("mobile-header-menu-nav-in");
            } else {
                mobileHeaderMenu.removeClass("mobile-header-menu-nav-in")
            }
        },
        hideMask: function (target) {
            var mask = $('.mask');
            mask.removeClass('in');
            if (target) {
                target.removeClass('in')
            }
        },
        share: function () {
            var shareSub = $('#share-sub');
            if (shareSub) {
                var shareList = $('#share-list'),
                    wxFab = $('#wxFab'),
                    close = $('#wxShare-close'),
                    mask = $('.mask');
                shareSub.click(function () {
                    if (shareList.hasClass('in')) {
                        shareList.removeClass('in');
                    } else {
                        shareList.addClass('in');
                    }
                });
                wxFab.click(function () {
                    var wxShare = $('#wxShare');
                    wxShare.addClass('in ready');
                    mask.addClass('in');
                });
                close.click(function () {
                    Blog.hideMask($('#wxShare'));
                });
                mask.click(function () {
                    Blog.hideMask($('#wxShare'));
                });
            }
        },
        reward: function () {
            var reward = $('#reward'),
                close = $('#reward-close'),
                rewardCode = $('#rewardCode'),
                rewardCheck = $('.reward-select-item'),
                mask = $('.mask');
            if (reward) {
                var rewardBtn = $('#rewardBtn');
                rewardBtn.click(function () {
                    reward.addClass('in ready');
                    mask.addClass('in');
                });
                rewardCheck.click(function () {
                    $(this).addClass('checked').siblings(rewardCheck).removeClass('checked');
                    rewardCode.attr('src', $(this).attr('data-id') === 'wechat' ? this.dataset.wechat : this.dataset.alipay);
                });
                close.click(function () {
                    Blog.hideMask(reward);
                });
                mask.click(function () {
                    Blog.hideMask(reward);
                });
            }
        },
        showSearch: function (status) {
            if (status) {
                searchWrap.css('top','50%');
                searchWrap.css('marginTop','-80px');
                searchWrap.css('opacity','1');
            } else {
                searchWrap.css('top','0');
                searchWrap.css('opacity','0');
                $('#keywords').val("");
                $('#search-container').removeClass('search-container-show');
            }
        },
    };

    //初始化搜索数据
    initSearch();
    //搜索点击事件
    search.click(function () {
        // searchWrap.css('top','50%');
        // searchWrap.css('marginTop','-80px');
        // searchWrap.css('opacity','1');
        Blog.showSearch(true);
        return false;
    });

    $('.search-close').click(function(){
        // searchWrap.css('top','0');
        // searchWrap.css('opacity','0');
        // $('#search-container').removeClass('search-container-show');
        Blog.showSearch(false);
    });

    searchWrap.click(function (e) {
        if (e.target.className == "search-item-li") {
            return true;
        }

        return false;
    });

    //tags | 标签
    Blog.setTags(tags);//pc
    Blog.setTags(mobileTags);//mobile
    //categories | 类别
    Blog.setCategories();
    //类别展示
    $("#sidebar-category").click(function (e) {
        if (sideMenuBoxIsOpen && categories.attr("style") == "display: block;") {
            Blog.showSidebarBox(false);
            sideMenuBoxIsOpen = false;
        } else {
            Blog.showSidebarBox(true);
            sideMenuBoxIsOpen = true;
        }
        tags.css('display', 'none');
        categories.css('display', 'block');
        e.stopPropagation();
    });
    //标签展示
    $("#sidebar-tag").click(function (e) {
        if (sideMenuBoxIsOpen && tags.attr("style") == "display: block;") {
            Blog.showSidebarBox(false);
            sideMenuBoxIsOpen = false;
        } else {
            Blog.showSidebarBox(true);
            sideMenuBoxIsOpen = true;
        }
        tags.css('display', 'block');
        categories.css('display', 'none');
        e.stopPropagation();
    });
    //点击菜单区域不能关闭菜单
    sideMenuBox.click(function (e) {
        e.stopPropagation();
        if (!sideMenuBoxIsOpen) {
            return false;
        }
    });
    //点击close按钮关闭菜单
    $(".sidebar-menu-box-close").click(function() {
        Blog.showSidebarBox(false);
        sideMenuBoxIsOpen = false;
    });

    //回到顶部点击事件
    backTop.click(function () {
        body.animate({
            scrollTop: 0
        }, 500);
    });

    //获取滚动事件
    d.addEventListener('scroll', function () {
        var scrollTop = d.documentElement.scrollTop || d.body.scrollTop;
        Blog.showHeaderMenu(scrollTop);
        Blog.showBackTop(scrollTop);
        Blog.showToc(scrollTop);
    }, false);
    
    //Mobile Menu
    $(".mobile-header-menu-button").click(function () {
        if (_mobileHeaderMenuLocked) {
            return false;
        }
        Blog.showMobileHeaderMenu(true);

        _mobileHeaderMenuLocked = true;

        window.setTimeout(function() {
            _mobileHeaderMenuLocked = false;
        }, 350);
    });

    //Share
    if (w.mihoConfig.share) {
        Blog.share();
    }

    //Reward
    if (w.mihoConfig.reward === 1 || w.mihoConfig.reward === 2) {
        Blog.reward();
    }
    //body
    body.click(function () {
        Blog.showSidebarBox(false);
        sideMenuBoxIsOpen = false;
        Blog.showMobileHeaderMenu(false);
        Blog.showSearch(false);
    });
})(window, document);
