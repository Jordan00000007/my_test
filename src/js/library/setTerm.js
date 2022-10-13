const SimpleHashTable = require('simple-hashtable');

export const getTerm = (name) => {

    let DataHash=new SimpleHashTable();
    let data='';
    
    switch (name) {

        case 'cht':

            data=`
                store,店家
                storeManage,店家管理
                userManage,使用者管理
                userSetting,個人設定
                smtpSetting,SMTP設定
                feedback,問題回報
                calibration,溫度校正
                logout,登出
                sensor,感測器
                event,事件
                address,地址
                contactPerson,聯絡人
                contactPhone,電話
                lost,遺失
                idle,閒置
                status,狀態
                temperature,溫度
                expiredDate,到期時間
                working,工作中
                userAdd,新增使用者
                storeAdd,新增店家
                confirm,確認
                cancel,取消
                storeName,店家名稱
                deleteStore,刪除店家
                gatewaySetting,閘道設定
                sensorSetting,感測器設定
                pleaseClickTheIconOnTheRightToAddAGateway,請點選右側圖標以新增閘道
                pleaseClickTheIconOnTheRightToAddASensor,請點選右側圖標以新增感測器
                selectSensor,選擇感測器
                selectGateway,選擇閘道
                delete,刪除
                sensorName,感測器名稱
                action,動作
                firmwareVersion,韌體版本
                role,角色
                userName,使用者名稱
                account,帳號
                password,密碼
                pushNotification,訊息推播通知
                browseableStores,可瀏覽店家
                pleaseClickTheIconOnTheRightToAddAStorePleaseClickTheIconOnTheRightToAddAStore,請點選右側圖標以新增店家
                selectStore,選擇店家
                deleteUser,刪除使用者
                questionType,問題類型
                questionDescription,問題描述
                temperatureGraph,溫度曲線圖
                languageSetting,語言設定
                userAccount,使用者帳號
                userPassword,使用者密碼
                letterEncryption,信件加密
                calculate,計算
                upload,上傳
                notEncrypted,不加密
                senderName,寄件人名稱
                expired,過期
                abnormal,異常
                unknow,未知
                time,時間
                selectTime,選擇時間
                startTime,開始時間
                endTime,結束時間
                sensorSettingValue,感測器設定
                eventName,事件名稱
                allEvent,所有事件
                allSensor,所有偵測器
                startUp,啟動
                exceedingTheUpperTemperatureLimit,超過溫度上限
                exceedingTheLowerTemperatureLimit,超過溫度下限
                voltageIsTooLow,電壓過低
                saveTimeExceeded,過保存時間
                malfunction,故障
                forgetPassword,忘記密碼
                login,登入
                temperatureIsTooHigh,溫度過高
                temperatureIsTooLow,溫度過低
                successfullyAddedAStore,新增店家成功
                successfullyAddedASensor,新增感測器成功
                storeNameCannotBeEmpty,店家名稱不得為空值
                failedToAddStorePleaseContactTheAdministrator,新增店家失敗,請聯絡管理員
                failedToQueryDataPleaseContactTheAdministrator,查詢資料失敗,請聯絡管理員
                confirmDelete,確定刪除
                storeDeletedSuccessfully,刪除店家成功
                failedToDeleteTheStorePleaseContactTheAdministrator,刪除店家失敗,請聯絡管理員
                modifyTheStoreSuccessfully,修改店家成功
                failedToModifyTheStorePleaseContactTheAdministrator,修改店家失敗,請聯絡管理員
                setTheWhitelistSuccessfully,設定白名單成功 
                failedToSetTheWhitelistPleaseContactTheAdministrator,設定白名單失敗,請聯絡管理員     
                failedToDeleteTheStorePleaseContactTheAdministrator,刪除店家失敗,請聯絡管理員
                failedToDeleteTheSensorPleaseContactTheAdministrator,刪除感測器失敗,請聯絡管理員
                usernameCannotBeEmpty,使用者名稱不得為空值
                theAccountDoesNotConformToTheEmailFormat,帳號不符合電子信箱格式
                passwordFormatIsWrong,密碼格式錯誤
                registrationSuccess,註冊成功
                registrationFailedMailboxHasBeenUsed,註冊失敗,信箱已被使用
                registrationFailedPleaseContactTheAdministrator,註冊失敗,請聯絡管理員
                failedToDeleteTheGatewayPleaseContactTheAdministrator,刪除閘道失敗,請聯絡管理員
                failedToDeleteUserPleaseContactTheAdministrator,刪除使用者失敗,請聯絡管理員
                failedToDeleteSensorPleaseContactTheAdministrator,刪除感測器失敗,請聯絡管理員
                userModifiedSuccessfully,修改使用者成功
                userDeletedSuccessfully,刪除使用者成功
                sensorDeletedSuccessfully,刪除感測器成功
                systemManager,系統管理者
                manager,管理者
                user,使用者
                updateCompleted,更新成功
                updateFailedPleaseContactTheAdministrator,更新失敗,請聯絡管理員
                emailFormatIsIncorrect,Email格式不正確
                usernameCannotContainBlankCharacters,使用者名稱不得包含空白字元
                hardwareIssue,硬體問題
                systemIssue,系統問題
                unknownType,未知類型
                addedSuccessfully,新增成功
                addingFailedPleaseContactTheAdministrator,新增失敗, 請聯絡管理員
                emailSentSuccessfully,傳送Email成功
                emailSendingFailedPleaseContactTheAdministrator,傳送Email失敗, 請聯絡管理員
                problemDescriptionContentIsNotFilledIn,問題描述內容未填寫
                version,版本
                phone,電話
                person,聯絡人
                originalABValue,原AB值
                originalTemperatureValue,原溫度值
                adjustedTemperatureValue,調整後溫度值
                adjustedABValue,調整後AB值
                temp,溫度
                parameterFormatError,參數格式錯誤
                queryNoData,查詢無資料
                email,信箱
                emailFormatError,信箱格式錯誤
                emailDoesNotExist,信箱不存在
                pleaseTryLater,請稍後在試
                theAuthenticationLetterHasBeenSuccessfullySentPleaseReturnToTheLoginPage,認證信已成功寄出,請返回登入頁面
                changePassword,變更密碼
                enterOldPassword,輸入舊密碼
                enterNewPassword,輸入新密碼
                confirmTheNewPassword,確認新密碼
                passwordChangedSuccessfully,變更密碼成功
                passwordChangeFailedThePasswordDoesNotMatch,變更密碼失敗,密碼不相符
                theNewPasswordDoesNotMatchTheConfirmedPassword,新密碼與確認密碼不相符
                newPasswordFormatIsWrong,新密碼格式錯誤
                oldPasswordFormatIsWrong,舊密碼格式錯誤
                branchName,分店名稱
                branchInformation,分店資訊
                sensorList,偵測器列表
                storeList,分店列表
                temperatureData,溫度資料      
                basicInformation,基本資料
                voltage,電壓
                expiredTime,剩餘期限
                expiredSetting,設定期限
                emailNotify,Email 通知
                lineNotify,Line 通知
                lineSubscription,Line 訂閱
                success,成功
                failed,失敗
                settings,設定
                test,測試
                inputTestString,輸入測試字串
                phoneNotify,電話通知
                sensorManage,感測器管理
                sensorAdd,新增感測器
                company,公司
                invalidFormat,無效的格式
                deleteSensor,刪除感測器
                sensorModifiedSuccessfully,感測器修改成功
                macDuplicated,MAC碼重複
                selectAll,全部選取
                deselectAll,全部不選
                nothingSelected,尚末選取項目
                itemsSelected,個項目已選取
                companyManage,公司管理
                companyName,公司名稱
                companyAdd,新增公司
                companyNameCannotBeEmpty,公司名稱不得為空值
                deleteCompany,刪除公司
                lineNotifyBindMultipleTimesJustWorkOnLastTime,Line通知綁定多次時,有效綁定以最後一次為主
                expireDate,使用期限
                emailNotExisted,信箱不存在
                passwordError,密碼錯誤
                companyExpired,公司使用期限已過
                loginFailed,登入失敗
                emailFormatError,信箱格式錯誤
                passwordFormatError,密碼格式錯誤
                gatewayManagement,閘道管理
                gatewayName,閘道名稱
                deleteItem,刪除項目
                gateway,閘道
                gatewayMac,閘道MAC
                gatewayAdd,新增閘道
                gatewayMacCannotBeEmpty,閘道MAC不得為空值
                gatewayMacFormatIsInvalid,閘道MAC格式錯誤
                deleteGateway,刪除閘道
                chartCompare,折線圖比較
                add,加入
                remove,移除
                dashboard,儀表板
                modifySensorName,修改感測器名稱
                userGuide,使用手冊
                userGuideUpload,使用手冊上傳
                download,下載
                chinese,中文
                english,英文
                japanese,日文
                battery,電量
                sliderPicture,輪播照片
                sensorSummary,感測器摘要
                storeSummary,分店摘要
                storeLocation,分店位置
                sensorSlider,感測器輪播
                unitMin,單位:分
                unitSec,單位:秒
                minValueAndMaxValue,最小值60秒,最大值43200秒
                shouldNotGreaterThanValueOfInactivity,不可大於 INACTIVITY
                online,線上
                offline,離線
                allItem,所有項目
                sensorConfigLog,感測器設定記錄
                close,關閉
                sensorReport,感測器回報
                dailySubscribe,每日資料訂閱
                subscribe,訂閱
                batchCalibration,批量校準
                temperatureSample,溫度樣本
                sample,樣本
                calibrtaionTarget,校正目標
                value,值
                testingDate,測試日期
                high,高
                low,低
                temperatureThreshold,溫度門檻值
                calibrtaionResult,校正結果
                highTemperaturePeriod,高溫區間
                lowTemperaturePeriod,低溫區間
                dataAmount,資料量
                highTemperatureAvarage,高溫平均
                lowTemperatureAvarage,低溫平均
                highTemperaturePeriodNoData,搜尋低溫區間無資料
                lowTemperaturePeriodNoData,搜尋高溫區間無資料
                uploadGateway,上傳閘道
                modifyBefore,修改前
                modifyAfter,修改後
                uploadAll,上傳所有
                highThreshold,高溫門檻值
                lowThreshold,低溫門檻值
                expiredDuration,過期區間
                lowBatteryThreshold,低電壓門檻值
                parameterA,參數A
                parameterB,參數B
                sensorWorkingMode,感測器工作模式
                dataTransmitFrequency,資料傳送頻率
                dataRecordingFrequency,資料記錄頻率
                logMode,記錄模式
                broadcastMode,廣播模式
                latitude,緯度
                longitude,經度
                coordinateSetting,座標設定
              
            
            
            `;
            
            break;
        case 'eng':

            data=`
                store,Store
                storeManage,Store Management
                userManage,User Management
                userSetting,User Settings
                smtpSetting,SMTP Settings
                feedback,Feedback
                calibration,Calibration
                logout,Log Out
                sensor,Sensor
                event,Event
                address,Address
                contactPerson,Contact Person
                contactPhone,Contact Number
                lost,Signal Loss
                idle,Idle
                status,Status
                temperature,Temperature
                expiredDate,Expiry Date
                working,Active
                userAdd,Create User
                storeAdd,Create Store
                confirm,Confirm
                cancel,Cancel
                storeName,Store Name
                deleteStore,Delete Store
                gatewaySetting,Gateway Settings
                sensorSetting,Sensor Settings
                pleaseClickTheIconOnTheRightToAddAGateway,Click on the right icon to create gateway
                pleaseClickTheIconOnTheRightToAddASensor,Click on the right icon to create sensor
                selectSensor,Select Sensor
                selectGateway,Select Gateway
                delete,Delete
                sensorName,Sensor Name
                action,Action
                firmwareVersion,Firmware Version
                role,Role
                userName,User Name
                account,Account
                password,Password
                pushNotification,Push Notification
                browseableStores,Available stores
                pleaseClickTheIconOnTheRightToAddAStorePleaseClickTheIconOnTheRightToAddAStore,Click on the right icon to create store
                selectStore,Select Store
                deleteUser,Delete User
                questionType,Question Type
                questionDescription,Question Description
                temperatureGraph,Temperature graph
                languageSetting,Language Settings
                userAccount,User Account
                userPassword,User Password
                letterEncryption,Email Encryption
                calculate,Calculate
                upload,Upload
                notEncrypted,Not encrypted
                senderName,Sender Name
                expired,Expired
                abnormal,Abnormal
                unknow,Unknown
                time,Time
                selectTime,Select Time
                startTime,Start Time
                endTime,End Time
                sensorSettingValue,Sensor Setting 
                eventName,Event Name
                allEvent,All Events
                allSensor,All Sensors
                startUp,Switch On
                exceedingTheUpperTemperatureLimit,High temp
                exceedingTheLowerTemperatureLimit,Low temp
                voltageIsTooLow,Voltage Is Too Low
                saveTimeExceeded,Expired
                malfunction,Malfunction
                forgetPassword,Forget Password
                login,Login
                temperatureIsTooHigh,High Temp
                temperatureIsTooLow,Low Temp
                successfullyAddedAStore,Store created successfully
                successfullyAddedASensor,Sensor created successfully
                storeNameCannotBeEmpty,Store name cannot be empty
                failedToAddStorePleaseContactTheAdministrator,Failed to add store, please contact the administrator
                failedToQueryDataPleaseContactTheAdministrator,Failed to query data, please contact the administrator
                confirmDelete,Confirm Delete
                storeDeletedSuccessfully,Store deleted successfully
                failedToDeleteTheStorePleaseContactTheAdministrator,Failed to delete store, please contact the administrator
                modifyTheStoreSuccessfully,Store modified successfully
                failedToModifyTheStorePleaseContactTheAdministrator,Failed to modify store, please contact the administrator
                setTheWhitelistSuccessfully,Whitelist configured successfully
                failedToSetTheWhitelistPleaseContactTheAdministrator,Failed to configure whitelist, please contact the administrator
                failedToDeleteTheStorePleaseContactTheAdministrator,Failed to delete store, please contact the administrator
                failedToDeleteTheSensorPleaseContactTheAdministrator,Failed to delete sensor, please contact the administrator
                usernameCannotBeEmpty,Username cannot be empty
                theAccountDoesNotConformToTheEmailFormat,The account does not conform to the email format
                passwordFormatIsWrong,Password format is wrong
                registrationSuccess,Registration Successful
                registrationFailedMailboxHasBeenUsed,Registration failed, email address is already in use
                registrationFailedPleaseContactTheAdministrator,Registration failed, please contact the administrator
                failedToDeleteTheGatewayPleaseContactTheAdministrator,Failed to delete gateway, please contact the administrator
                failedToDeleteUserPleaseContactTheAdministrator,Failed to delete user, please contact the administrator
                failedToDeleteSensorPleaseContactTheAdministrator,Failed to delete sensor, please contact the administrator
                userModifiedSuccessfully,User modified successfully
                userDeletedSuccessfully,User deleted successfully
                sensorDeletedSuccessfully,Sensor deleted successfully
                systemManager,System Manager
                manager,Manager
                user,User
                updateCompleted,Update Completed
                updateFailedPleaseContactTheAdministrator,Update failed, please contact the administrator
                emailFormatIsIncorrect,Email is invalid
                usernameCannotContainBlankCharacters,Username cannot contain spaces " "
                hardwareIssue,Hardware Issue
                systemIssue,System Issue
                unknownType,Unknow Type
                addedSuccessfully,Created Successfully
                addingFailedPleaseContactTheAdministrator,Creation failed, please contact the administrator
                emailSentSuccessfully,Email sent successfully
                emailSendingFailedPleaseContactTheAdministrator,Email sending failed, please contact the administrator
                problemDescriptionContentIsNotFilledIn,Problem description is empty
                version,Version
                phone,Contact number
                person,Contact person
                originalABValue,Original AB Value
                originalTemperatureValue,Original Temp Value
                adjustedTemperatureValue,Adjusted Temp Value
                adjustedABValue,Adjusted AB value
                temp,Temp
                parameterFormatError,Parameter is invalid
                queryNoData,No data found
                email,Email
                emailFormatError,Email is invalid
                emailDoesNotExist,Email does not exist
                pleaseTryLater,Please try again later
                theAuthenticationLetterHasBeenSuccessfullySentPleaseReturnToTheLoginPage,Confirmation email is sent, please return to login page
                changePassword,Change Password
                enterOldPassword,Enter old password
                enterNewPassword,Enter new password
                confirmTheNewPassword,Confirm new password
                passwordChangedSuccessfully,Password changed successfully
                passwordChangeFailedThePasswordDoesNotMatch,Password change failed, password doesn't match
                theNewPasswordDoesNotMatchTheConfirmedPassword,New password doesn't match confirm password
                newPasswordFormatIsWrong,New password is invalid
                oldPasswordFormatIsWrong,Old password is invalid
                branchName,Branch Name
                branchInformation,Branch Information
                sensorList,Sensor List
                storeList,Store List
                temperatureData,Temperature Data
                basicInformation,Basic Information
                voltage,Voltage
                expiredTime,Expire Time
                expiredSetting,Expiry date settings
                emailNotify,Email Notify
                lineNotify,Line Notify
                lineSubscription,Line Subscription
                success,Success
                failed,Failed
                settings,Settings
                test,Test
                inputTestString,Input Test String
                phoneNotify,Phone Notify
                sensorManage,Sensor Management
                sensorAdd,Create Sensor
                company,Company
                invalidFormat,Invalid Format
                deleteSensor,Delete Sensor
                sensorModifiedSuccessfully,Sensor modified successfully
                macDuplicated,MAC duplicated
                selectAll,Select All
                deselectAll,Deselect All
                nothingSelected,Nothing Selected
                itemsSelected,items selected
                companyManage,Company Management
                companyName,Company Name
                companyAdd,Create Company
                companyNameCannotBeEmpty,Company name cannot be empty
                deleteCompany,Delete Company
                lineNotifyBindMultipleTimesJustWorkOnLastTime,When line notify binded multiple times, just works for last time
                expireDate,Expire Date
                emailNotExisted,Email not existed
                passwordError,Password error
                companyExpired,Company expired
                loginFailed,Login failed
                emailFormatError,Email format error
                passwordFormatError,Password format error
                gatewayManagement,Gateway management
                gatewayName,Gateway Name
                deleteItem,Delete Item
                gateway,Gateway
                gatewayMac,Gateway MAC
                gatewayAdd,Create Gateway
                gatewayMacCannotBeEmpty,Gateway MAC can not be empty
                gatewayMacFormatIsInvalid,Gateway MAC format is invalided
                deleteGateway,Delete Gateway
                chartCompare,Chart Compare
                add,Add
                remove,Remove
                dashboard,Dashboard
                modifySensorName,Modify sensor name
                userGuide,User Guide
                userGuideUpload,User Guide Upload
                download,Download
                chinese,Chinese
                english,English
                japanese,Japanese
                battery,Battery
                sliderPicture,Slider Picture
                sensorSummary,Sensor Summary
                storeSummary,Store Summary
                storeLocation,Store Location
                sensorSlider,Sensor Slider
                unitMin,Unit:Min
                unitSec,Unit:Sec
                minValueAndMaxValue,Minimum value 60 and maximum value 43200
                shouldNotGreaterThanValueOfInactivity,Shoud not greater then value of INACTIVITY
                online,Online
                offline,Offline
                allItem,All items
                sensorConfigLog,Sensor config log
                close,Close
                sensorReport,Sensor Report
                dailySubscribe,Daily Subscribe
                subscribe,Subscribe
                batchCalibration,Batch Calibrtaion
                temperatureSample,Temperature Sample
                sample,Sample
                calibrtaionTarget,Calibrtaion Target
                value,Value
                testingDate,Testing Date
                high,High
                low,Low
                temperatureThreshold,Temperature Threshold
                calibrtaionResult,Calibrtaion Result
                highTemperaturePeriod,High Temperature Period
                lowTemperaturePeriod,Low Temperature Period
                dataAmount,Data Amount
                highTemperatureAvarage,High Temperature Avarage
                lowTemperatureAvarage,Low Temperature Avarage
                highTemperaturePeriodNoData,High Temperature Period No Data
                lowTemperaturePeriodNoData,Low Temperature Period No Data
                uploadGateway,Upload Gateway
                modifyBefore,Modify Before
                modifyAfter,Modify After
                uploadAll,Upload All
                highThreshold,High Threshold
                lowThreshold,Low Threshold
                expiredDuration,Expired Duration
                lowBatteryThreshold,Low Battery Threshold
                parameterA,Parameter A
                parameterB,Parameter B
                sensorWorkingMode,Sensor Working Mode
                dataTransmitFrequency,Data Transmit Frequency
                dataRecordingFrequency,Data Recording Frequency
                logMode,Log Mode
                broadcastMode,Broadcast Mode
                latitude,Latitude
                longitude,Longitude
                coordinateSetting,Coordinate Setting
            `;

            break;
        case 'jpn':

            data=`
                store,お店
                storeManage,ストア管理
                userManage,ユーザー管理
                userSetting,ユーザー設定
                smtpSetting,SMTP設定
                feedback,フィードバック
                calibration,温度補正
                logout,ログアウト
                sensor,センサー
                event,イベント
                address,住所
                contactPerson,連絡窓口
                contactPhone,電話
                lost,失われた
                idle,アイドル
                status,状態
                temperature,温度
                expiredDate,有効期限
                working,ワーキング
                userAdd,ユーザーを追加する
                storeAdd,ストアを追加
                confirm,確認
                cancel,キャンセル
                storeName,店名
                deleteStore,ストアを削除する
                gatewaySetting,ゲートウェイ設定
                sensorSetting,センサー設定
                pleaseClickTheIconOnTheRightToAddAGateway,ゲートウェイを追加するには、右側のアイコンをクリックしてください
                pleaseClickTheIconOnTheRightToAddASensor,センサーを追加するには、右側のアイコンをクリックしてください
                selectSensor,センサーを選択
                selectGateway,ゲートウェイを選択
                delete,削除
                sensorName,センサー名
                action,アクション
                firmwareVersion,ファームウェアバージョン
                role,キャラクター
                userName,ユーザー名
                account,アカウント
                password,パスワード
                pushNotification,プッシュ通知
                browseableStores,閲覧可能なストア
                pleaseClickTheIconOnTheRightToAddAStorePleaseClickTheIconOnTheRightToAddAStore,右側のアイコンをクリックしてストアを追加してください
                selectStore,ストアを選択
                deleteUser,ユーザーを削除する
                questionType,質問の種類
                questionDescription,質問の説明
                temperatureGraph,温度グラフ
                languageSetting,言語設定
                userAccount,ユーザーのアカウント
                userPassword,ユーザーのパスワード
                letterEncryption,文字の暗号化
                calculate,計算
                upload,アップロード
                notEncrypted,暗号化されていません
                senderName,送信者名
                expired,期限切れ
                abnormal,異常な
                unknow,わからない
                time,時間
                selectTime,時間を選択
                startTime,始まる時間
                endTime,終了時間
                sensorSettingValue,センサー設定値
                eventName,イベント名
                allEvent,すべてのイベント
                allSensor,すべてのセンサー
                startUp,起動
                exceedingTheUpperTemperatureLimit,上限温度を超えています
                exceedingTheLowerTemperatureLimit,下限温度を超えています
                voltageIsTooLow,電圧が低すぎる
                saveTimeExceeded,保存時間を超えました
                malfunction,故障
                forgetPassword,パスワードを忘れる
                login,ログインする
                temperatureIsTooHigh,温度が高すぎる
                temperatureIsTooLow,温度が低すぎる
                successfullyAddedAStore,ストアの追加に成功しました
                successfullyAddedASensor,センサーの追加に成功
                storeNameCannotBeEmpty,ストア名を空にすることはできません
                failedToAddStorePleaseContactTheAdministrator,ストアの追加に失敗しました。管理者に連絡してください
                failedToQueryDataPleaseContactTheAdministrator,データのクエリに失敗しました。管理者に連絡してください
                confirmDelete,削除の確認
                storeDeletedSuccessfully,ストアが正常に削除されました
                failedToDeleteTheStorePleaseContactTheAdministrator,ストアの削除に失敗しました。管理者に連絡してください
                modifyTheStoreSuccessfully,ストアの変更に成功しました
                failedToModifyTheStorePleaseContactTheAdministrator,ストアの変更に失敗しました。管理者に連絡してください
                setTheWhitelistSuccessfully,ホワイトリストを正常に設定する
                failedToSetTheWhitelistPleaseContactTheAdministrator,ホワイトリストの設定に失敗しました。管理者に連絡してください
                failedToDeleteTheStorePleaseContactTheAdministrator,ストアの削除に失敗しました。管理者に連絡してください
                failedToDeleteTheSensorPleaseContactTheAdministrator,センサーの削除に失敗しました。管理者に連絡してください
                usernameCannotBeEmpty,ユーザー名を空にすることはできません
                theAccountDoesNotConformToTheEmailFormat,アカウントがメール形式に準拠していません
                passwordFormatIsWrong,パスワードの形式が間違っている
                registrationSuccess,登録完了
                registrationFailedMailboxHasBeenUsed,登録に失敗しました、メールボックスが使用されました
                registrationFailedPleaseContactTheAdministrator,登録に失敗しました。管理者に連絡してください
                failedToDeleteTheGatewayPleaseContactTheAdministrator,ゲートウェイの削除に失敗しました。管理者に連絡してください
                failedToDeleteUserPleaseContactTheAdministrator,ユーザーの削除に失敗しました。管理者に連絡してください
                failedToDeleteSensorPleaseContactTheAdministrator,センサーの削除に失敗しました。管理者に連絡してください。管理者に連絡してください。管理者に連絡してください
                userModifiedSuccessfully,ユーザーが正常に変更されました
                userDeletedSuccessfully,ユーザーが正常に削除されました
                sensorDeletedSuccessfully,センサーが正常に削除されました
                systemManager,システムマネージャー
                manager,マネージャー
                user,ユーザー
                updateCompleted,更新が完了しました
                updateFailedPleaseContactTheAdministrator,更新に失敗しました。管理者に連絡してください
                emailFormatIsIncorrect,メールフォーマットが正しくない
                usernameCannotContainBlankCharacters,ユーザー名に空白文字を含めることはできません
                hardwareIssue,ハードウェアの問題
                systemIssue,システムの問題
                unknownType,不明なタイプ
                addedSuccessfully,正常に追加されました
                addingFailedPleaseContactTheAdministrator,追加に失敗しました。管理者に連絡してください
                emailSentSuccessfully,電子メールを正常に送信
                emailSendingFailedPleaseContactTheAdministrator,メール送信に失敗しました。管理者に連絡してください
                problemDescriptionContentIsNotFilledIn,問題の説明の内容が入力されていません
                version,版本
                phone,電話
                person,連絡窓口
                originalABValue,元のAB値
                originalTemperatureValue,元の温度値
                adjustedTemperatureValue,調整された温度値
                adjustedABValue,調整されたAB値
                temp,温度
                parameterFormatError,パラメータフォーマットエラー
                queryNoData,データをクエリしない
                email,Eメール
                emailFormatError,メールフォーマットエラー
                emailDoesNotExist,メールは存在しません
                pleaseTryLater,後でお試しください
                theAuthenticationLetterHasBeenSuccessfullySentPleaseReturnToTheLoginPage,認証レターが正常に送信されました。ログインページに戻ってください
                changePassword,パスワードを変更する
                enterOldPassword,古いパスワードを入力してください
                enterNewPassword,新しいパスワードを入力
                confirmTheNewPassword,新しいパスワードを確認します
                passwordChangedSuccessfully,パスワードは正常に変更されました
                passwordChangeFailedThePasswordDoesNotMatch,パスワードの変更に失敗しました。パスワードが一致しません
                theNewPasswordDoesNotMatchTheConfirmedPassword,新しいパスワードが確認済みのパスワードと一致しません
                newPasswordFormatIsWrong,新しいパスワードの形式が間違っています
                oldPasswordFormatIsWrong,古いパスワードの形式が間違っています
                branchName,支店名
                branchInformation,支店情報
                sensorList,センサーリスト
                storeList,ストアリスト
                temperatureData,温度データ
                basicInformation,基本情報
                voltage,電圧
                expiredTime,残り期間
                expiredSetting,期限を設定する
                emailNotify,メール通知
                lineNotify,Line通知
                lineSubscription,Line サブスクリプション
                success,成功
                failed,失敗しました
                settings,設定
                test,テスト
                inputTestString,テスト文字列を入力します
                phoneNotify,Phone通知
                sensorManage,センサー管理
                sensorAdd,新しいセンサー
                company,会社
                invalidFormat,無効な形式
                deleteSensor,センサーを削除する
                sensorModifiedSuccessfully,センサーが正常に変更されました
                macDuplicated,MACが重複しています
                selectAll,すべて選択
                deselectAll,すべての選択を解除
                nothingSelected,何も選択されていません
                itemsSelected,選択したアイテム
                companyManage,会社作成
                companyName,会社名
                companyAdd,会社を作る
                companyNameCannotBeEmpty,会社名を空にすることはできません
                deleteCompany,会社を削除する
                lineNotifyBindMultipleTimesJustWorkOnLastTime,Line通知が複数回バインドされた場合、最後にのみ機能します
                expireDate,使用期間
                emailNotExisted,メールが存在しませんでした
                passwordError,パスワードエラー
                companyExpired,会社の有効期限が切れました
                loginFailed,ログインに失敗しました
                emailFormatError,メールフォーマットエラー
                passwordFormatError,パスワードフォーマットエラー
                gatewayManagement,ゲートウェイ管理
                gatewayName,ゲートウェイ名
                deleteItem,アイテムを削除
                gateway,ゲートウェイ
                gatewayMac,ゲートウェイMAC
                gatewayAdd,ゲートウェイを作成する
                gatewayMacCannotBeEmpty,ゲートウェイMACを空にすることはできません
                gatewayMacFormatIsInvalid,ゲートウェイMAC形式が無効です
                deleteGateway,ゲートウェイを削除する
                chartCompare,チャート比較
                add,追加
                remove,削除する
                dashboard,ダッシュボード
                modifySensorName,センサー名を変更する
                userManual,ユーザーマニュアル
                userGuide,ユーザーガイド
                download,ダウンロード
                chinese,中国語
                english,英語
                japanese,日本語
                battery,バッテリー
                sliderPicture,スライダー画像
                sensorSummary,センサーの概要
                storeSummary,ストアの概要
                storeLocation,店の場所
                sensorSlider,センサースライダー
                unitMin,単位:分
                unitSec,単位:秒
                minValueAndMaxValue,最小値60および最大値43200
                shouldNotGreaterThanValueOfInactivity,INACTIVITYの値より大きくないこと
                online,オンライン
                offline,オフライン
                allItem,全てのアイテム
                sensorConfigLog,センサー構成ログ
                close,閉鎖
                sensorReport,センサーレポート
                dailySubscribe,毎日購読
                subscribe,購読
                batchCalibration,バッチキャリブレーション
                temperatureSample,温度サンプル
                sample,サンプル
                calibrtaionTarget,キャリブレーションターゲット
                value,価値
                testingDate,試験日
                high,高い
                low,低い
                temperatureThreshold,温度しきい値
                calibrtaionResult,キャリブレーション結果
                highTemperaturePeriod,高温期間
                lowTemperaturePeriod,低温期間
                dataAmount,データ量
                highTemperatureAvarage,高温平均
                lowTemperatureAvarage,低温平均
                highTemperaturePeriodNoData,高温期間データなし
                lowTemperaturePeriodNoData,低温期間データなし
                uploadGateway,ゲートウェイをアップロード
                modifyBefore,前に変更
                modifyAfter,変更後
                uploadAll,すべてアップロード
                highThreshold,高いしきい値
                lowThreshold,低しきい値
                expiredDuration,有効期限が切れた期間
                lowBatteryThreshold,バッテリしきい値が低い
                parameterA,パラメータA
                parameterB,パラメータB
                sensorWorkingMode,センサー動作モード
                dataTransmitFrequency,データ送信頻度
                dataRecordingFrequency,データの記録頻度
                logMode,ログモード
                broadcastMode,ブロードキャストモード
                latitude,緯度
                longitude,経度
                coordinateSetting,座標設定
            `;

            break;

    }

    let dataArr=data.split(/\n/);
    dataArr.forEach(ele => {
        let item=ele.trim();
        if ((item.length>0)&&(item.indexOf(",")>=0)){
            //console.log(item)
            let key=item.split(",")[0];
            let value=item.split(",")[1];

            if (item.length>=3){
                value=item.replace(key+',',"")
            }

            DataHash.put(key,value);
        }
    });

    return DataHash;

}

export const setTerm = (langId) => {
    
    let term=null;
    
    switch(langId) {
        case 1:
            // cht
            term=getTerm('cht');
            break;
        case 2:
            // eng
            term=getTerm('eng');
            break;
        case 3:
            // eng
            term=getTerm('jpn');
            break;
        default:
            // cht
            term=getTerm('cht');
            break;
    }

    $('.span_store').html(term.get('store'));
    $('.span_storeManage').html(term.get('storeManage'));
    $('.span_userManage').html(term.get('userManage'));
    $('.span_userSetting').html(term.get('userSetting'));
    $('.span_smtpSetting').html(term.get('smtpSetting'));
    $('.span_feedback').html(term.get('feedback'));
    $('.span_calibration').html(term.get('calibration'));
    $('.span_logout').html(term.get('logout'));
    $('.span_sensor').html(term.get('sensor'));
    $('.span_event').html(term.get('event'));
    $('.span_status').html(term.get('status'));
    $('.span_temperature').html(term.get('temperature'));
    $('.span_expiredDate').html(term.get('expiredDate'));
    $('.span_userAdd').html(term.get('userAdd'));
    $('.span_storeAdd').html(term.get('storeAdd'));
    $('.span_confirm').html(term.get('confirm'));
    $('.span_cancel').html(term.get('cancel'));
    $('.span_address').html(term.get('address'));
    $('.span_contactPhone').html(term.get('contactPhone'));
    $('.span_contactPerson').html(term.get('contactPerson'));
    $('.span_storeName').html(term.get('storeName'));
    $('.span_deleteStore').html(term.get('deleteStore'));
    $('.span_gatewaySetting').html(term.get('gatewaySetting'));
    $('.span_sensorSetting').html(term.get('sensorSetting'));
    $('.span_pleaseClickTheIconOnTheRightToAddAGateway').html(term.get('pleaseClickTheIconOnTheRightToAddAGateway'));
    $('.span_pleaseClickTheIconOnTheRightToAddASensor').html(term.get('pleaseClickTheIconOnTheRightToAddASensor'));
    $('.span_selectSensor').html(term.get('selectSensor'));
    $('.span_selectGateway').html(term.get('selectGateway'));
    $('.span_delete').html(term.get('delete'));
    $('.span_sensorName').html(term.get('sensorName'));
    $('.span_action').html(term.get('action'));
    $('.span_firmwareVersion').html(term.get('firmwareVersion'));
    $('.span_role').html(term.get('role'));
    $('.span_userName').html(term.get('userName'));
    $('.span_account').html(term.get('account'));
    $('.span_password').html(term.get('password'));
    $('.span_pushNotification').html(term.get('pushNotification'));
    $('.span_browseableStores').html(term.get('browseableStores'));
    $('.span_pleaseClickTheIconOnTheRightToAddAStorePleaseClickTheIconOnTheRightToAddAStore').html(term.get('pleaseClickTheIconOnTheRightToAddAStorePleaseClickTheIconOnTheRightToAddAStore'));
    $('.span_selectStore').html(term.get('selectStore'));
    $('.span_deleteUser').html(term.get('deleteUser'));
    $('.span_questionType').html(term.get('questionType'));
    $('.span_questionDescription').html(term.get('questionDescription'));
    $('.span_temperatureGraph').html(term.get('temperatureGraph'));
    $('.span_languageSetting').html(term.get('languageSetting'));
    $('.span_userAccount').html(term.get('userAccount'));
    $('.span_userPassword').html(term.get('userPassword'));
    $('.span_letterEncryption').html(term.get('letterEncryption'));
    $('.span_calculate').html(term.get('calculate'));
    $('.span_upload').html(term.get('upload'));
    $('.span_notEncrypted').html(term.get('notEncrypted'));
    $('.span_senderName').html(term.get('senderName'));
    $('.span_time').html(term.get('time'));
    $('.span_selectTime').html(term.get('selectTime'));
    $('.span_startTime').html(term.get('startTime'));
    $('.span_endTime').html(term.get('endTime'));
    $('.span_sensorSettingValue').html(term.get('sensorSettingValue'));
    $('.span_eventName').html(term.get('eventName'));
    $('.span_allEvent').html(term.get('allEvent'));
    $('.span_allSensor').html(term.get('allSensor'));
    $('.span_forgetPassword').html(term.get('forgetPassword'));
    $('.span_login').html(term.get('login'));
    $('.span_originalABValue').html(term.get('originalABValue'));
    $('.span_originalTemperatureValue').html(term.get('originalTemperatureValue'));
    $('.span_adjustedTemperatureValue').html(term.get('adjustedTemperatureValue'));
    $('.span_adjustedABValue').html(term.get('adjustedABValue'));
    $('.span_temp').html(term.get('temp'));
    $('.span_changePassword').html(term.get('changePassword'));
    $('.span_enterOldPassword').html(term.get('enterOldPassword'));
    $('.span_enterNewPassword').html(term.get('enterNewPassword'));
    $('.span_confirmTheNewPassword').html(term.get('confirmTheNewPassword'));
    $('.span_expiredTime').html(term.get('expiredTime'));
    $('.span_expiredSetting').html(term.get('expiredSetting'));
    $('.span_emailNotify').html(term.get('emailNotify'));
    $('.span_lineNotify').html(term.get('lineNotify'));
    $('.span_lineSubscription').html(term.get('lineSubscription'));
    $('.span_test').html(term.get('test'));
    $('.span_phoneNotify').html(term.get('phoneNotify'));
    $('.span_sensorManage').html(term.get('sensorManage'));
    $('.span_sensorAdd').html(term.get('sensorAdd'));
    $('.span_exceedingTheUpperTemperatureLimit').html(term.get('exceedingTheUpperTemperatureLimit'));
    $('.span_exceedingTheLowerTemperatureLimit').html(term.get('exceedingTheLowerTemperatureLimit'));
    $('.span_company').html(term.get('company'));
    $('.span_deleteSensor').html(term.get('deleteSensor'));
    $('.span_companyManage').html(term.get('companyManage'));
    $('.span_companyName').html(term.get('companyName'));
    $('.span_companyAdd').html(term.get('companyAdd'));
    $('.span_deleteCompany').html(term.get('deleteCompany'));
    $('.span_lineNotifyBindMultipleTimesJustWorkOnLastTime').html(term.get('lineNotifyBindMultipleTimesJustWorkOnLastTime'));
    $('.span_expireDate').html(term.get('expireDate'));
    $('.span_gatewayManagement').html(term.get('gatewayManagement'));
    $('.span_gatewayName').html(term.get('gatewayName'));
    $('.span_gateway').html(term.get('gateway'));
    $('.span_gatewayMac').html(term.get('gatewayMac'));
    $('.span_gatewayAdd').html(term.get('gatewayAdd'));
    $('.span_deleteGateway').html(term.get('deleteGateway'));
    $('.span_chartCompare').html(term.get('chartCompare'));
    $('.span_add').html(term.get('add'));
    $('.span_remove').html(term.get('remove'));
    $('.span_dashboard').html(term.get('dashboard'));
    $('.span_lost').html(term.get('lost'));
    $('.span_modifySensorName').html(term.get('modifySensorName'));
    $('.span_userManual').html(term.get('userManual'));
    $('.span_userGuideUpload').html(term.get('userGuideUpload'));
    $('.span_download').html(term.get('download'));
    $('.span_userGuide').html(term.get('userGuide'));
    $('.span_chinese').html(term.get('chinese'));
    $('.span_english').html(term.get('english'));
    $('.span_japanese').html(term.get('japanese'));
    $('.span_battery').html(term.get('battery'));
    $('.span_sliderPicture').html(term.get('sliderPicture'));
    $('.span_sensorSummary').html(term.get('sensorSummary'));
    $('.span_storeSummary').html(term.get('storeSummary'));
    $('.span_storeLocation').html(term.get('storeLocation'));
    $('.span_sensorSlider').html(term.get('sensorSlider'));
    $('.span_unitMin').html(term.get('unitMin'));
    $('.span_unitSec').html(term.get('unitSec'));
    $('.span_minValueAndMaxValue').html(term.get('minValueAndMaxValue'));
    $('.span_shouldNotGreaterThanValueOfInactivity').html(term.get('shouldNotGreaterThanValueOfInactivity'));
    $('.span_sensorConfigLog').html(term.get('sensorConfigLog'));
    $('.span_close').html(term.get('close'));
    $('.span_sensorReport').html(term.get('sensorReport'));
    $('.span_dailySubscribe').html(term.get('dailySubscribe'));
    $('.span_subscribe').html(term.get('subscribe'));
    $('.span_batchCalibration').html(term.get('batchCalibration'));
    $('.span_temperatureSample').html(term.get('temperatureSample'));
    $('.span_sample').html(term.get('sample'));
    $('.span_calibrtaionTarget').html(term.get('calibrtaionTarget'));
    $('.span_value').html(term.get('value'));
    $('.span_testingDate').html(term.get('testingDate'));
    $('.span_high').html(term.get('high'));
    $('.span_low').html(term.get('low'));
    $('.span_temperatureThreshold').html(term.get('temperatureThreshold'));
    $('.span_calibrtaionResult').html(term.get('calibrtaionResult'));
    $('.span_highTemperaturePeriod').html(term.get('highTemperaturePeriod'));
    $('.span_lowTemperaturePeriod').html(term.get('lowTemperaturePeriod'));
    $('.span_uploadGateway').html(term.get('uploadGateway'));
    $('.span_modifyBefore').html(term.get('modifyBefore'));
    $('.span_modifyAfter').html(term.get('modifyAfter'));
    $('.span_uploadAll').html(term.get('uploadAll'));
    $('.span_highThreshold').html(term.get('highThreshold'));
    $('.span_lowThreshold').html(term.get('lowThreshold'));
    $('.span_expiredDuration').html(term.get('expiredDuration'));
    $('.span_lowBatteryThreshold').html(term.get('lowBatteryThreshold'));
    $('.span_parameterA').html(term.get('parameterA'));
    $('.span_parameterB').html(term.get('parameterB'));
    $('.span_sensorWorkingMode').html(term.get('sensorWorkingMode'));
    $('.span_dataTransmitFrequency').html(term.get('dataTransmitFrequency'));
    $('.span_dataRecordingFrequency').html(term.get('dataRecordingFrequency'));
    $('.span_logMode').html(term.get('logMode'));
    $('.span_broadcastMode').html(term.get('broadcastMode'));
    $('.span_latitude').html(term.get('latitude'));
    $('.span_longitude').html(term.get('longitude'));
    $('.span_coordinateSetting').html(term.get('coordinateSetting'));
   

    

   

}

export const oneTerm = (langId,str) => {

    let term=null;
    
    switch(langId) {
        case 1:
            // cht
            term=getTerm('cht');
            break;
        case 2:
            // eng
            term=getTerm('eng');
            break;
        case 3:
            // eng
            term=getTerm('jpn');
            break;
        default:
            // cht
            term=getTerm('cht');
            break;
    }

    return term.get(str);


}