<template>
    <f7-page name="home">
        <!-- Top Navbar -->
        <f7-navbar large>
            <f7-nav-title>WarungPOS</f7-nav-title>
            <f7-nav-title-large>WarungPOS</f7-nav-title-large>
        </f7-navbar>
        <!-- Toolbar-->
        <f7-toolbar bottom>
            <f7-link>Keluar</f7-link>
            <f7-link login-screen-open=".demo-login-screen">Masuk</f7-link>
        </f7-toolbar>
        <!-- Page content-->
        <f7-block>
            <p>Dapatkan keunggulan dalam pengelolaan usaha Anda dengan solusi Point of Sales modern kami yang tidak hanya
                menyederhanakan transaksi, tetapi juga memberikan wawasan mendalam tentang inventaris, penjualan, dan
                perilaku pelanggan. Tingkatkan efisiensi, pantau kinerja toko, dan ciptakan pengalaman belanja yang lebih
                baik bagi pelanggan Anda dengan teknologi POS yang andal dan inovatif!</p>
            <img src="../assets/womanwarung.png" width="300x" class="lazy" />
        </f7-block>

        <f7-login-screen v-model:opened="loginScreenOpened" class="demo-login-screen">
            <f7-page login-screen>
                <f7-login-screen-title>WarungPOS</f7-login-screen-title>
                <f7-list form>
                    <f7-list-input label="Username" type="text" placeholder="Your username" :value="username"
                        @input="username = $event.target.value"></f7-list-input>
                    <f7-list-input label="Password" type="password" placeholder="Your password" :value="password"
                        @input="password = $event.target.value"></f7-list-input>
                </f7-list>
                <f7-list inset>
                    <f7-list-button @click="signIn">Sign In</f7-list-button>
                    <f7-list-button @click="close">Close</f7-list-button>
                    <f7-block-footer>WarungPOS@2024.<br />Signature</f7-block-footer>
                </f7-list>
            </f7-page>
        </f7-login-screen>

    </f7-page>
</template>

<script>
import {
    f7Navbar,
    f7Page,
    f7LoginScreen,
    f7List,
    f7ListItem,
    f7Block,
    f7Button,
    f7LoginScreenTitle,
    f7BlockFooter,
    f7ListButton,
    f7ListInput,
    f7,
} from 'framework7-vue';

export default {
    components: {
        f7Navbar,
        f7Page,
        f7LoginScreen,
        f7List,
        f7ListItem,
        f7Block,
        f7Button,
        f7LoginScreenTitle,
        f7BlockFooter,
        f7ListButton,
        f7ListInput,
    },
    data() {
        return {
            loginScreenOpened: false,
            username: '',
            password: '',
        };
    },
    methods: {
        signIn() {
            const self = this;

            f7.dialog.alert(`Username: ${self.username}<br>Password: ${self.password}`, () => {
                f7.loginScreen.close();
            });
        },
        close() {
            this.loginScreenOpened = false;
        },
    },
};
</script>