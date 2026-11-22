# Changelog

> Versions up to 1.1.6 were published as `@lauravivan/notion-portfolio`. The notes for 2.0.0 to 2.0.8 are only on the [GitHub releases page](https://github.com/lauvivans/kami/releases). From the next version on, release-please writes this file.

## [3.1.0](https://github.com/lauvivans/kami/compare/v3.0.0...v3.1.0) (2026-11-22)


### Features

* add a numbered list block ([#230](https://github.com/lauvivans/kami/issues/230)) ([d93b78a](https://github.com/lauvivans/kami/commit/d93b78af3e27385b41c43ce07041e99cd63e0155)), closes [#227](https://github.com/lauvivans/kami/issues/227)
* add a posts list block ([#231](https://github.com/lauvivans/kami/issues/231)) ([e137c47](https://github.com/lauvivans/kami/commit/e137c477fcc1a34ebc9e7352a8850243ec1be195)), closes [#226](https://github.com/lauvivans/kami/issues/226)
* add a table block ([#232](https://github.com/lauvivans/kami/issues/232)) ([2c5fb0d](https://github.com/lauvivans/kami/commit/2c5fb0d79c01e953252321806dad1c27a396cb18)), closes [#228](https://github.com/lauvivans/kami/issues/228)
* open images in a full-screen viewer ([#223](https://github.com/lauvivans/kami/issues/223)) ([a4da7e8](https://github.com/lauvivans/kami/commit/a4da7e8f4689ef98e24ae730377a4953355b3ff0)), closes [#193](https://github.com/lauvivans/kami/issues/193)
* write pages in Markdown ([#229](https://github.com/lauvivans/kami/issues/229)) ([cdce73e](https://github.com/lauvivans/kami/commit/cdce73e493c549fc906939352689d5a570a5878e)), closes [#225](https://github.com/lauvivans/kami/issues/225)


### Bug Fixes

* add the image to the bookmark block ([#221](https://github.com/lauvivans/kami/issues/221)) ([50c9ac7](https://github.com/lauvivans/kami/commit/50c9ac7dc8d572fb6fae9d01a6100e566f25af7a)), closes [#220](https://github.com/lauvivans/kami/issues/220)

## [3.0.0](https://github.com/lauvivans/kami/compare/v2.2.0...v3.0.0) (2026-11-22)


### ⚠ BREAKING CHANGES

* removed Sass variables and their replacements:

### Features

* add a load limit with a Load more button to database views ([#205](https://github.com/lauvivans/kami/issues/205)) ([44e0324](https://github.com/lauvivans/kami/commit/44e0324671c188e399eacdd268f743b350f5899b)), closes [#192](https://github.com/lauvivans/kami/issues/192)
* add a Quote block ([#196](https://github.com/lauvivans/kami/issues/196)) ([80026d8](https://github.com/lauvivans/kami/commit/80026d82812ad673e8ac39374eacfddf9b80ff02)), closes [#185](https://github.com/lauvivans/kami/issues/185)
* add a Show more block that limits any list of blocks ([#219](https://github.com/lauvivans/kami/issues/219)) ([988bfc5](https://github.com/lauvivans/kami/commit/988bfc54b48cc7901b2688637c47ffa6bfb52e26)), closes [#218](https://github.com/lauvivans/kami/issues/218)
* center the page content in a reading column ([#195](https://github.com/lauvivans/kami/issues/195)) ([2440096](https://github.com/lauvivans/kami/commit/244009609657d8eaf75f9b9dc5850ddcece2992c)), closes [#179](https://github.com/lauvivans/kami/issues/179)
* finish moving the themes to the semantic tokens ([#204](https://github.com/lauvivans/kami/issues/204)) ([0961e6e](https://github.com/lauvivans/kami/commit/0961e6e6bee898ca8e22f41ed051f86bcef2352d)), closes [#183](https://github.com/lauvivans/kami/issues/183)
* give the bookmark block a favicon and Notion-like spacing ([#214](https://github.com/lauvivans/kami/issues/214)) ([f1025d5](https://github.com/lauvivans/kami/commit/f1025d5d5b48b7a4635d08dd301d1e74098544cc)), closes [#212](https://github.com/lauvivans/kami/issues/212)
* make Filter and Sort work in database views ([#167](https://github.com/lauvivans/kami/issues/167)) ([7b97ddd](https://github.com/lauvivans/kami/commit/7b97dddbf1d023d51d8124587403efed742c88fd)), closes [#164](https://github.com/lauvivans/kami/issues/164)
* refresh the database views and the tags ([#197](https://github.com/lauvivans/kami/issues/197)) ([bed145b](https://github.com/lauvivans/kami/commit/bed145bab18d7d7b904303c04ea9c671b95c9cee)), closes [#181](https://github.com/lauvivans/kami/issues/181)
* refresh the header, breadcrumb and tabs ([#198](https://github.com/lauvivans/kami/issues/198)) ([0bbd043](https://github.com/lauvivans/kami/commit/0bbd043e116fcbb464af865a515f828ba3f0e493)), closes [#178](https://github.com/lauvivans/kami/issues/178)
* refresh the page, settings and search modals ([#199](https://github.com/lauvivans/kami/issues/199)) ([f64b829](https://github.com/lauvivans/kami/commit/f64b829d11a3407da0f557ce9981a4884e1a1c9a)), closes [#182](https://github.com/lauvivans/kami/issues/182)
* refresh the sidebar and floating sidebar ([#201](https://github.com/lauvivans/kami/issues/201)) ([6b7f0aa](https://github.com/lauvivans/kami/commit/6b7f0aa607d1e15c43f499588ad5f51e806fc7c5)), closes [#177](https://github.com/lauvivans/kami/issues/177)
* refresh the text blocks ([#202](https://github.com/lauvivans/kami/issues/202)) ([40a8b53](https://github.com/lauvivans/kami/commit/40a8b530595c37e3082841cf0c162cb41bbdb6d4)), closes [#180](https://github.com/lauvivans/kami/issues/180)
* replace the design tokens with a semantic set ([#194](https://github.com/lauvivans/kami/issues/194)) ([487e480](https://github.com/lauvivans/kami/commit/487e4808fe7045c2a4d4c219753e928c4de91e84)), closes [#176](https://github.com/lauvivans/kami/issues/176)
* restyle the footer badge as a small pill ([#200](https://github.com/lauvivans/kami/issues/200)) ([f5879fa](https://github.com/lauvivans/kami/commit/f5879faaf4a422b54b7820349713fae6553832b3)), closes [#184](https://github.com/lauvivans/kami/issues/184)
* show the full page title in a tooltip when it's cut off ([#207](https://github.com/lauvivans/kami/issues/207)) ([0629f80](https://github.com/lauvivans/kami/commit/0629f80c745b35c90fde598225e473fc8ffad605)), closes [#191](https://github.com/lauvivans/kami/issues/191)


### Bug Fixes

* close the floating sidebar on touch screens ([#188](https://github.com/lauvivans/kami/issues/188)) ([ce0b29e](https://github.com/lauvivans/kami/commit/ce0b29e9510fffca726edc9c45cc92d0571a37bd)), closes [#172](https://github.com/lauvivans/kami/issues/172)
* give the sidebar scrollbar room and a thin style in every browser ([#203](https://github.com/lauvivans/kami/issues/203)) ([de21a69](https://github.com/lauvivans/kami/commit/de21a695d26d6969e10ad363a123d064c549cbd9)), closes [#186](https://github.com/lauvivans/kami/issues/186)
* keep the header above the content and fit the layout to the mobile viewport ([#171](https://github.com/lauvivans/kami/issues/171)) ([b9bed20](https://github.com/lauvivans/kami/commit/b9bed207882a3f796d8855873a9d56bbcfcb0ad7)), closes [#168](https://github.com/lauvivans/kami/issues/168)
* let link components set their own hover color ([#209](https://github.com/lauvivans/kami/issues/209)) ([51f8ec7](https://github.com/lauvivans/kami/commit/51f8ec73f5519e97e39c3d034a70093b3638a755)), closes [#208](https://github.com/lauvivans/kami/issues/208)
* make the page modal use the screen height on phones ([#187](https://github.com/lauvivans/kami/issues/187)) ([cb772e0](https://github.com/lauvivans/kami/commit/cb772e03f3648c9b27c8caf57c707207390b3290)), closes [#173](https://github.com/lauvivans/kami/issues/173)
* open links to portfolio pages in the same tab ([#206](https://github.com/lauvivans/kami/issues/206)) ([e990c1a](https://github.com/lauvivans/kami/commit/e990c1a7840c2910d2b736a36aa5f82ed07daeaf)), closes [#190](https://github.com/lauvivans/kami/issues/190)
* point the Icons enum at icon names that exist ([#217](https://github.com/lauvivans/kami/issues/217)) ([acd5efe](https://github.com/lauvivans/kami/commit/acd5efef9323256419b76224070c81a282053b27)), closes [#216](https://github.com/lauvivans/kami/issues/216)
* rebuild the toggle list on native details to match the visual refresh ([#215](https://github.com/lauvivans/kami/issues/215)) ([826456b](https://github.com/lauvivans/kami/commit/826456bc71bc130a234f9288b84ee24f570a3c8a)), closes [#210](https://github.com/lauvivans/kami/issues/210)
* show the URL in link mentions that have no label ([#213](https://github.com/lauvivans/kami/issues/213)) ([0e48d31](https://github.com/lauvivans/kami/commit/0e48d31e4a673ab6308136dd0109ab9296a2314b)), closes [#211](https://github.com/lauvivans/kami/issues/211)

## [2.2.0](https://github.com/lauvivans/kami/compare/v2.1.0...v2.2.0) (2026-11-22)


### Features

* add a table view to databases ([#158](https://github.com/lauvivans/kami/issues/158)) ([929e567](https://github.com/lauvivans/kami/commit/929e567d8ac2268c4b5cffd49e15fb64e38c5b30)), closes [#49](https://github.com/lauvivans/kami/issues/49)
* collapse long breadcrumbs into a menu ([#157](https://github.com/lauvivans/kami/issues/157)) ([52b8579](https://github.com/lauvivans/kami/commit/52b8579631431ddb9b017cd6c7c7a174f5317188)), closes [#50](https://github.com/lauvivans/kami/issues/50)
* open the settings menus as dropdowns without an overlay ([#166](https://github.com/lauvivans/kami/issues/166)) ([0118ce3](https://github.com/lauvivans/kami/commit/0118ce3408e2dd81fd2734687138a9fcf8a171cd)), closes [#163](https://github.com/lauvivans/kami/issues/163)


### Bug Fixes

* drop restored tabs whose page no longer exists ([#160](https://github.com/lauvivans/kami/issues/160)) ([3dd7544](https://github.com/lauvivans/kami/commit/3dd75448a7cef3fcb230d0a87faff435e73dd92c)), closes [#151](https://github.com/lauvivans/kami/issues/151)
* handle taps on tabs and the sidebar button with click only ([#165](https://github.com/lauvivans/kami/issues/165)) ([93a4352](https://github.com/lauvivans/kami/commit/93a4352d8b517da35f99460dbee33aef534b4339)), closes [#162](https://github.com/lauvivans/kami/issues/162)
* keep database page text within narrow screens ([#155](https://github.com/lauvivans/kami/issues/155)) ([b92cf5f](https://github.com/lauvivans/kami/commit/b92cf5fe3921fc258208d90120917b508699dadb)), closes [#153](https://github.com/lauvivans/kami/issues/153)
* keep list item content on one line ([#156](https://github.com/lauvivans/kami/issues/156)) ([d86d5f6](https://github.com/lauvivans/kami/commit/d86d5f6d23d5eb242de09d9bf9f9cd4d712c994b)), closes [#154](https://github.com/lauvivans/kami/issues/154)
* open gallery database cards only on tap on touch devices ([#159](https://github.com/lauvivans/kami/issues/159)) ([43bf38b](https://github.com/lauvivans/kami/commit/43bf38ba328c5812f99279ae13bbf5c39ccd0d7f)), closes [#152](https://github.com/lauvivans/kami/issues/152)

## [2.1.0](https://github.com/lauvivans/kami/compare/v2.0.9...v2.1.0) (2026-11-21)


### Features

* add useIsMobile and close the sidebar after picking a page on mobile ([#143](https://github.com/lauvivans/kami/issues/143)) ([a5915b2](https://github.com/lauvivans/kami/commit/a5915b2ca44b2649c860fb8324f94ba8e2f02e04)), closes [#48](https://github.com/lauvivans/kami/issues/48)


### Bug Fixes

* let breadcrumb titles use the free header space ([#142](https://github.com/lauvivans/kami/issues/142)) ([c190842](https://github.com/lauvivans/kami/commit/c190842957ed67bc800fac02b4b24ffcf3aecf8a)), closes [#116](https://github.com/lauvivans/kami/issues/116)

## [2.0.9](https://github.com/lauvivans/kami/compare/v2.0.8...v2.0.9) (2026-11-21)


### Bug Fixes

* **deps-dev:** bump @types/node from 25.9.9 to 26.6.6 in /template ([#123](https://github.com/lauvivans/kami/issues/123)) ([022eaa7](https://github.com/lauvivans/kami/commit/022eaa719946937b5450afbe545e8ddf4c048fa0))

## [1.1.6](https://github.com/lauvivans/kami/compare/v1.1.5...v1.1.6) (2025-12-31)


### Bug Fixes

* add state management for current page in modal static ([a61a3f5](https://github.com/lauvivans/kami/commit/a61a3f5bc9fa872f289ba8c9133d774ab3a707b7))

## [1.1.5](https://github.com/lauvivans/kami/compare/v1.1.4...v1.1.5) (2025-12-30)


### Bug Fixes

* use page path in routing ([d08b8fd](https://github.com/lauvivans/kami/commit/d08b8fd1cebebb8663a743bef5218ec7b8694ba6))

## [1.1.4](https://github.com/lauvivans/kami/compare/v1.1.3...v1.1.4) (2025-12-30)


### Bug Fixes

* link mention style, modal responsiveness and layout rules, add test page and fix small issues ([0343fdc](https://github.com/lauvivans/kami/commit/0343fdcc39b8723e4966442045a8b5eb0a16fa61))

## [1.1.3](https://github.com/lauvivans/kami/compare/v1.1.2...v1.1.3) (2025-12-29)


### Bug Fixes

* settings sync, images on template and other issues ([ad8c6f6](https://github.com/lauvivans/kami/commit/ad8c6f64b38c94645752fbaba8b55dbd3ecdf1f5))

## [1.1.2](https://github.com/lauvivans/kami/compare/v1.1.1...v1.1.2) (2025-12-29)


### Bug Fixes

* remove scoped ([c0752f9](https://github.com/lauvivans/kami/commit/c0752f91eb2f6fbf0b5817028d8c6b6536cfcae6))


### Reverts

* index page and metadata ([2de9e3f](https://github.com/lauvivans/kami/commit/2de9e3f1295cd37f7ab00c3dcc8f7d7246da50e0))

## [1.1.1](https://github.com/lauvivans/kami/compare/v1.1.0...v1.1.1) (2025-12-29)


### Bug Fixes

* remove component from database props and separate content logic for reuse ([d81be35](https://github.com/lauvivans/kami/commit/d81be35ef9d7d31897084aa68b082ea65d29953f))
* spacing and links ([eb179d9](https://github.com/lauvivans/kami/commit/eb179d942664b4eeab526b95880ad8854f9b83d0))
* static modal styles, separate settings modal logic to be reusable, dynamic info sync ([9d695a8](https://github.com/lauvivans/kami/commit/9d695a87507ce4731c5b465fd7f8220dc97622ac))
* static modal styles, separate settings modal logic to be reusable, dynamic info sync ([04aa85b](https://github.com/lauvivans/kami/commit/04aa85b3deaf4b85402fefcfb9b3425b58843cea))

# [1.1.0](https://github.com/lauvivans/kami/compare/v1.0.5...v1.1.0) (2025-12-27)


### Bug Fixes

* aside nested links disposition and scrollbar themes ([6c68490](https://github.com/lauvivans/kami/commit/6c684904e9adb212db43be40f6e25fa5af5f61d7))
* bg color on tab hover - theme ([bd7fbcf](https://github.com/lauvivans/kami/commit/bd7fbcf94a718667b49e0bada1e22081e5bd9454))
* breadcrumb nested pages ([941909e](https://github.com/lauvivans/kami/commit/941909e524d0a673048bf5c0663540e3828043f4))
* breadcrumb parent page and nav nested links style ([a54e564](https://github.com/lauvivans/kami/commit/a54e564dfd50cd206e349040a04f4207b1fed240))
* database properties logic and styling ([1f412ac](https://github.com/lauvivans/kami/commit/1f412ac3a7066a337f0c11a5423f32abc2cdacf1))
* little style adjustments, add global icon ([f05266a](https://github.com/lauvivans/kami/commit/f05266a6dba55a1e5b8e248f1b073acc011a25a2))
* page and metadata structure, aside nested pages behavior (parent and children) ([1a1ca78](https://github.com/lauvivans/kami/commit/1a1ca78a32db43f7649244ba57be0e0df1619ae7))
* tabs sync in page update and fixed tab when 1 ([521763c](https://github.com/lauvivans/kami/commit/521763cdee2cc1dd3a300b2c156ff81e3466339f))


### Features

* add component for default link and text highlight ([db38e04](https://github.com/lauvivans/kami/commit/db38e04a87707a47c66dcd919e9ed66349d18884))
* add resizible columns ([f631e82](https://github.com/lauvivans/kami/commit/f631e8200e2bef2ecd3cf4b2b3bb3aa07020f167))

## [1.0.5](https://github.com/lauvivans/kami/compare/v1.0.4...v1.0.5) (2025-12-24)


### Bug Fixes

* add build step before release and delete my portfolio folder ([3318d2c](https://github.com/lauvivans/kami/commit/3318d2c291787acf9ec5dc308ca53689c778fa3d))
* add gh token env ([7fb0b1c](https://github.com/lauvivans/kami/commit/7fb0b1c41808422b288ede885989383afad5510f))
* adjust banner and icon height, add link to icon and fix page info type ([9905552](https://github.com/lauvivans/kami/commit/9905552f134c00c69fc133a4065d283cb68a8e57))
* force version bump ([e66eb59](https://github.com/lauvivans/kami/commit/e66eb59d7ddfa066136a1931291bd84b25514256))
* force version bump ([4e47ab1](https://github.com/lauvivans/kami/commit/4e47ab1825133bd5586f2e512733a64c12015a7c))
* include gitignore file in template ([b970f22](https://github.com/lauvivans/kami/commit/b970f225749ddba2c104121e38559783e0b057da))
* show menu header icon, add icons folder, fix tab z index ([2c72531](https://github.com/lauvivans/kami/commit/2c72531fd603d5362cd88cdebe72e7569a224222))
* update node version ([70a2f43](https://github.com/lauvivans/kami/commit/70a2f439fbadf3a13587da0d82d05df0f65fe2f4))
* update node version ([c1308db](https://github.com/lauvivans/kami/commit/c1308db690ccb48457f870b5d23127b5f1afb00b))

## [1.0.4](https://github.com/lauvivans/kami/compare/v1.0.3...v1.0.4) (2025-12-24)


### Bug Fixes

* show menu header icon, add icons folder, fix tab z index ([6056db0](https://github.com/lauvivans/kami/commit/6056db00784d2579e0a87ae9e6a8b8403d03a7dd))

## [1.0.3](https://github.com/lauvivans/kami/compare/v1.0.2...v1.0.3) (2025-12-23)


### Bug Fixes

* include gitignore file in template ([0c81110](https://github.com/lauvivans/kami/commit/0c8111040644531eeee58fa8ecde9d1016661cd0))

## [1.0.2](https://github.com/lauvivans/kami/compare/v1.0.1...v1.0.2) (2025-12-23)


### Bug Fixes

* add build step before release and delete my portfolio folder ([8d42ad1](https://github.com/lauvivans/kami/commit/8d42ad19681f0b1baef5971cb554fc341128e016))

## [1.0.1](https://github.com/lauvivans/kami/compare/v1.0.0...v1.0.1) (2025-12-23)


### Bug Fixes

* force version bump ([dfd5469](https://github.com/lauvivans/kami/commit/dfd5469c8b4c37a0c7ba12d7249df6d2093244f4))

# 1.0.0 (2025-12-23)


### Bug Fixes

* add gh token env ([70a64c4](https://github.com/lauvivans/kami/commit/70a64c46039c411421641e2a54ba4fb70b27dcff))
* build issues ([af7a252](https://github.com/lauvivans/kami/commit/af7a252c7d5a301fb3cdaeff0cdfe27330b87ba8))
* delete core and components from src ([1d64ad5](https://github.com/lauvivans/kami/commit/1d64ad50785eab132fe1d38ce1ce74f6cdcdec32))
* fix lint issues for now ([5396aa2](https://github.com/lauvivans/kami/commit/5396aa2eedf48588baa37d2e4fff67c3f6f69bdf))
* force version bump ([d2a801d](https://github.com/lauvivans/kami/commit/d2a801d67d04e5cd76949281c3864e3186651da0))
* reinstall dependencies ([a33d106](https://github.com/lauvivans/kami/commit/a33d1060b59d576e2dd3ed7286e3b5073760a372))
* relate histories and merge ([e9b464b](https://github.com/lauvivans/kami/commit/e9b464bbb5b686d1cd1ef31a428052a197e03603))
* separate build files ([f25c4f5](https://github.com/lauvivans/kami/commit/f25c4f5365ce0ee729d8529b12c66665a177a9ef))
* update node version ([7fdc48b](https://github.com/lauvivans/kami/commit/7fdc48b2d1acd40bc225fb11600d40012e00453c))
* update node version ([0e1a195](https://github.com/lauvivans/kami/commit/0e1a195393391621941640231823e3c1b5849f2e))


### Features

* add visual study in projects ([203c26c](https://github.com/lauvivans/kami/commit/203c26ce6a801f4a57c214d57fad4f0b5c4dc565))

# 1.0.0 (2025-12-23)


### Bug Fixes

* add gh token env ([70a64c4](https://github.com/lauvivans/kami/commit/70a64c46039c411421641e2a54ba4fb70b27dcff))
* build issues ([af7a252](https://github.com/lauvivans/kami/commit/af7a252c7d5a301fb3cdaeff0cdfe27330b87ba8))
* delete core and components from src ([1d64ad5](https://github.com/lauvivans/kami/commit/1d64ad50785eab132fe1d38ce1ce74f6cdcdec32))
* fix lint issues for now ([5396aa2](https://github.com/lauvivans/kami/commit/5396aa2eedf48588baa37d2e4fff67c3f6f69bdf))
* reinstall dependencies ([a33d106](https://github.com/lauvivans/kami/commit/a33d1060b59d576e2dd3ed7286e3b5073760a372))
* relate histories and merge ([e9b464b](https://github.com/lauvivans/kami/commit/e9b464bbb5b686d1cd1ef31a428052a197e03603))
* separate build files ([f25c4f5](https://github.com/lauvivans/kami/commit/f25c4f5365ce0ee729d8529b12c66665a177a9ef))
* update node version ([7fdc48b](https://github.com/lauvivans/kami/commit/7fdc48b2d1acd40bc225fb11600d40012e00453c))
* update node version ([0e1a195](https://github.com/lauvivans/kami/commit/0e1a195393391621941640231823e3c1b5849f2e))


### Features

* add visual study in projects ([203c26c](https://github.com/lauvivans/kami/commit/203c26ce6a801f4a57c214d57fad4f0b5c4dc565))

# 1.0.0 (2025-12-23)


### Bug Fixes

* add gh token env ([70a64c4](https://github.com/lauvivans/kami/commit/70a64c46039c411421641e2a54ba4fb70b27dcff))
* build issues ([af7a252](https://github.com/lauvivans/kami/commit/af7a252c7d5a301fb3cdaeff0cdfe27330b87ba8))
* delete core and components from src ([1d64ad5](https://github.com/lauvivans/kami/commit/1d64ad50785eab132fe1d38ce1ce74f6cdcdec32))
* fix lint issues for now ([5396aa2](https://github.com/lauvivans/kami/commit/5396aa2eedf48588baa37d2e4fff67c3f6f69bdf))
* reinstall dependencies ([a33d106](https://github.com/lauvivans/kami/commit/a33d1060b59d576e2dd3ed7286e3b5073760a372))
* relate histories and merge ([e9b464b](https://github.com/lauvivans/kami/commit/e9b464bbb5b686d1cd1ef31a428052a197e03603))
* separate build files ([f25c4f5](https://github.com/lauvivans/kami/commit/f25c4f5365ce0ee729d8529b12c66665a177a9ef))
* update node version ([7fdc48b](https://github.com/lauvivans/kami/commit/7fdc48b2d1acd40bc225fb11600d40012e00453c))
* update node version ([0e1a195](https://github.com/lauvivans/kami/commit/0e1a195393391621941640231823e3c1b5849f2e))


### Features

* add visual study in projects ([203c26c](https://github.com/lauvivans/kami/commit/203c26ce6a801f4a57c214d57fad4f0b5c4dc565))

# 1.0.0 (2025-12-23)


### Bug Fixes

* add gh token env ([70a64c4](https://github.com/lauvivans/kami/commit/70a64c46039c411421641e2a54ba4fb70b27dcff))
* build issues ([af7a252](https://github.com/lauvivans/kami/commit/af7a252c7d5a301fb3cdaeff0cdfe27330b87ba8))
* delete core and components from src ([1d64ad5](https://github.com/lauvivans/kami/commit/1d64ad50785eab132fe1d38ce1ce74f6cdcdec32))
* fix lint issues for now ([5396aa2](https://github.com/lauvivans/kami/commit/5396aa2eedf48588baa37d2e4fff67c3f6f69bdf))
* reinstall dependencies ([a33d106](https://github.com/lauvivans/kami/commit/a33d1060b59d576e2dd3ed7286e3b5073760a372))
* relate histories and merge ([e9b464b](https://github.com/lauvivans/kami/commit/e9b464bbb5b686d1cd1ef31a428052a197e03603))
* separate build files ([f25c4f5](https://github.com/lauvivans/kami/commit/f25c4f5365ce0ee729d8529b12c66665a177a9ef))
* update node version ([7fdc48b](https://github.com/lauvivans/kami/commit/7fdc48b2d1acd40bc225fb11600d40012e00453c))
* update node version ([0e1a195](https://github.com/lauvivans/kami/commit/0e1a195393391621941640231823e3c1b5849f2e))


### Features

* add visual study in projects ([203c26c](https://github.com/lauvivans/kami/commit/203c26ce6a801f4a57c214d57fad4f0b5c4dc565))

# 1.0.0 (2025-12-23)


### Bug Fixes

* add gh token env ([70a64c4](https://github.com/lauvivans/kami/commit/70a64c46039c411421641e2a54ba4fb70b27dcff))
* build issues ([af7a252](https://github.com/lauvivans/kami/commit/af7a252c7d5a301fb3cdaeff0cdfe27330b87ba8))
* delete core and components from src ([1d64ad5](https://github.com/lauvivans/kami/commit/1d64ad50785eab132fe1d38ce1ce74f6cdcdec32))
* fix lint issues for now ([5396aa2](https://github.com/lauvivans/kami/commit/5396aa2eedf48588baa37d2e4fff67c3f6f69bdf))
* reinstall dependencies ([a33d106](https://github.com/lauvivans/kami/commit/a33d1060b59d576e2dd3ed7286e3b5073760a372))
* relate histories and merge ([e9b464b](https://github.com/lauvivans/kami/commit/e9b464bbb5b686d1cd1ef31a428052a197e03603))
* separate build files ([f25c4f5](https://github.com/lauvivans/kami/commit/f25c4f5365ce0ee729d8529b12c66665a177a9ef))
* update node version ([7fdc48b](https://github.com/lauvivans/kami/commit/7fdc48b2d1acd40bc225fb11600d40012e00453c))
* update node version ([0e1a195](https://github.com/lauvivans/kami/commit/0e1a195393391621941640231823e3c1b5849f2e))


### Features

* add visual study in projects ([203c26c](https://github.com/lauvivans/kami/commit/203c26ce6a801f4a57c214d57fad4f0b5c4dc565))
