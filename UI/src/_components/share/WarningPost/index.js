import { Card, Carousel, Image, Tag } from 'antd';
import React from 'react';
import UserAvatar from '_components/share/UserAvatar';
import './WarningPost.scss';
import Moment from 'react-moment';
import { TOPIC_NAMES, TOPIC_TAGS } from '_constants';

const { Meta } = Card;

// Template for both Warning post and Comment
export default function WarningPost({ warning }) {
  const title = warning.user.fullname;
  // if (warning.user.is_following) {
  //   title = (
  //     <>
  //       <span>warning.user.fullname</span>
  //       <StarTwoTone />
  //     </>
  //   );
  // }

  return (
    <div className="warning-post">
      <Meta
        avatar={<UserAvatar src={warning.user.avatar} size={41} />}
        title={title}
        description={<Moment fromNow>{warning.time}</Moment>}
      />
      {warning.topic && (
        <Tag className="warning-post__topic" color={TOPIC_TAGS[warning.topic]}>
          {TOPIC_NAMES[warning.topic]}
        </Tag>
      )}
      <div className="warning-post__description">
        {warning.short_description && (
          <>
            <strong>{warning.short_description}</strong>
            <br />
          </>
        )}
        {warning.long_description}
      </div>
      {warning.photos && (
        <Carousel>
          {warning.photos.map((photo) => (
            <Image key={photo.id} src={photo.src} preview={false} width="100%" height="25rem" />
          ))}
        </Carousel>
      )}
    </div>
  );
}
