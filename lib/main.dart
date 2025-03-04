import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/services.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Local HTML Example',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LocalHtmlPage(),
    );
  }
}

class LocalHtmlPage extends StatefulWidget {
  const LocalHtmlPage({Key? key}) : super(key: key);

  @override
  State<LocalHtmlPage> createState() => _LocalHtmlPageState();
}

class _LocalHtmlPageState extends State<LocalHtmlPage> {
  late InAppWebViewController _webViewController;
  final String _updateUrl =
      "https://updatesite.ithj.net/kcbup_android_flutter_jseikcb.json";
  final String _currentVersion = "1.0.2"; // 本地版本号

  static const platform = MethodChannel('com.example.app/browser');

  @override
  void initState() {
    super.initState();
    _checkForUpdates();
  }

  Future<void> _checkForUpdates() async {
    try {
      final response = await http.get(Uri.parse(_updateUrl));

      if (response.statusCode == 200) {
        final updateInfo = json.decode(response.body);
        final serverVersion = updateInfo['version'];
        final downloadUrl = updateInfo['Url'];
        final updateNotes = updateInfo['New'];

        if (_isNewVersion(serverVersion, _currentVersion)) {
          _showUpdateDialog(serverVersion, updateNotes, downloadUrl);
        }
      } else {
        print('Failed to fetch update info: ${response.statusCode}');
      }
    } catch (e) {
      print('Error checking for updates: $e');
    }
  }

  bool _isNewVersion(String serverVersion, String currentVersion) {
    final serverParts = serverVersion.split('.').map(int.parse).toList();
    final currentParts = currentVersion.split('.').map(int.parse).toList();

    for (int i = 0; i < serverParts.length; i++) {
      if (serverParts[i] > currentParts[i]) {
        return true;
      } else if (serverParts[i] < currentParts[i]) {
        return false;
      }
    }
    return false;
  }

  void _showUpdateDialog(String version, String updateNotes, String url) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('发现新版本 v$version'),
        content: Text(updateNotes),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('稍后再说'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              _openBrowser(url);
            },
            child: const Text('下载更新'),
          ),
        ],
      ),
    );
  }

  Future<void> _openBrowser(String url) async {
    try {
      await platform.invokeMethod('openBrowser', {'url': url});
    } catch (e) {
      print('Error opening browser: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PreferredSize(
        preferredSize:
            Size.fromHeight(MediaQuery.of(context).size.height * 0.0005),
        child: AppBar(
          title: const Text('Best Wish to ur Body😊'),
          backgroundColor: const Color.fromARGB(255, 226, 255, 203),
        ),
      ),
      body: InAppWebView(
        initialFile: 'assets/web/index/index.html',
        initialOptions: InAppWebViewGroupOptions(
          crossPlatform: InAppWebViewOptions(
            javaScriptEnabled: true,
          ),
        ),
        onWebViewCreated: (controller) {
          _webViewController = controller;
        },
      ),
    );
  }
}
